/**
 * notifier.ts — SMTP email delivery for OTP codes
 *
 * Design decisions:
 * - No module-level transporter: created fresh on each call so .env changes
 *   take effect without restart and there's no stale-state bug.
 * - Always logs OTP to console in development (usable even if SMTP fails).
 * - Hard fails in production if email doesn't send.
 */

import nodemailer from 'nodemailer';

// Read credentials directly from process.env every time — never cache them
function getSmtpConfig() {
  return {
    host:   process.env.SMTP_HOST || 'smtp.gmail.com',
    port:   parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',   // false = STARTTLS on port 587
    user:   process.env.SMTP_USER || '',
    pass:   process.env.SMTP_PASS || '',
  };
}

// ─── HTML email builder ───────────────────────────────────────────────────────
function buildOTPHtml(recipientEmail: string, otp: string, purposeLabel: string): string {
  const digitBoxes = otp
    .split('')
    .map(
      d => `<span style="
        display:inline-block;width:48px;height:60px;line-height:60px;
        text-align:center;background:#F1EFE8;border-radius:10px;
        font-size:28px;font-weight:800;color:#534AB7;margin:0 4px;
      ">${d}</span>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="font-family:Arial,sans-serif;background:#F1EFE8;margin:0;padding:32px 16px;">
  <div style="max-width:460px;margin:0 auto;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,0.08);">
    <div style="background:#534AB7;padding:28px;text-align:center;">
      <span style="font-size:26px;font-weight:900;color:#fff;letter-spacing:3px;">PMS.</span>
    </div>
    <div style="padding:36px;">
      <h2 style="color:#2C2C2A;margin:0 0 8px;font-size:20px;">${purposeLabel} Verification</h2>
      <p style="color:#888780;font-size:14px;line-height:1.6;margin:0 0 28px;">
        Your one-time password expires in <strong>10 minutes</strong>.
      </p>
      <div style="text-align:center;margin:24px 0;">${digitBoxes}</div>
      <p style="background:#EEEDFE;border-radius:10px;padding:14px;color:#534AB7;font-size:13px;font-weight:600;margin:0;">
        🔒 Never share this code. PMS will never ask for it.
      </p>
    </div>
    <div style="padding:16px 36px;border-top:1px solid #F1EFE8;color:#B8B7B0;font-size:11px;text-align:center;">
      Sent to ${recipientEmail}. Ignore if you didn't request this.
    </div>
  </div>
</body>
</html>`;
}

// ─── Main export ──────────────────────────────────────────────────────────────
export async function sendOTPEmail(
  recipientEmail: string,
  otp: string,
  purpose: 'login' | 'register' = 'login'
): Promise<boolean> {
  const purposeLabel = purpose === 'register' ? 'Registration' : 'Login';
  const isDev = process.env.NODE_ENV !== 'production';

  // ── Always print to console so developers can test without email ──────────
  console.log('\n' + '═'.repeat(55));
  console.log(`  📧 OTP EMAIL REQUEST`);
  console.log(`  To      : ${recipientEmail}`);
  console.log(`  Purpose : ${purposeLabel}`);
  console.log(`  OTP     : ${otp}   ← use this if email doesn't arrive`);
  console.log('═'.repeat(55) + '\n');

  // ── Read credentials fresh from env every call ────────────────────────────
  const cfg = getSmtpConfig();

  if (!cfg.user || !cfg.pass) {
    console.error('❌ SMTP_USER or SMTP_PASS missing from .env — cannot send email');
    return isDev; // true in dev (console OTP is enough), false in prod
  }

  // ── Create a fresh transporter for this send ──────────────────────────────
  const transporter = nodemailer.createTransport({
    host:   cfg.host,
    port:   cfg.port,
    secure: cfg.secure,
    auth:   { user: cfg.user, pass: cfg.pass },
    connectionTimeout: 10_000,
    greetingTimeout:   8_000,
    socketTimeout:     12_000,
    tls: { rejectUnauthorized: true },
  });

  // ── Verify connection before sending ─────────────────────────────────────
  try {
    await transporter.verify();
    console.log('  ✅ SMTP connection verified');
  } catch (verifyErr) {
    const msg = (verifyErr as Error).message;
    console.error(`  ❌ SMTP verify failed: ${msg}`);
    console.error('  Hint: wrong App Password, or port 587 blocked? Try port 465 + SMTP_SECURE=true');

    if (isDev) {
      console.warn('  ⚠️  Dev mode: use the OTP printed above to continue testing\n');
      return true; // let the flow continue via console OTP in dev
    }
    return false;
  }

  // ── Send the email ────────────────────────────────────────────────────────
  try {
    const info = await transporter.sendMail({
      from:    `"PMS — Project Manager" <${cfg.user}>`,
      to:      recipientEmail,
      subject: `${otp} is your PMS ${purposeLabel} code`,
      html:    buildOTPHtml(recipientEmail, otp, purposeLabel),
      text:    `Your PMS ${purposeLabel} OTP is: ${otp}\n\nExpires in 10 minutes. Do not share.`,
    });

    console.log(`  ✅ Email sent! MessageId: ${info.messageId}\n`);
    return true;

  } catch (sendErr) {
    const err = sendErr as any;
    console.error(`  ❌ Email send failed: ${err.message}`);
    if (err.responseCode) console.error(`  SMTP Response ${err.responseCode}: ${err.response}`);

    if (isDev) {
      console.warn('  ⚠️  Dev mode: use the OTP printed above to continue testing\n');
      return true;
    }
    return false;
  } finally {
    // Always close the connection after each send
    transporter.close();
  }
}

// ─── Generic email helper (kept for future notifications) ────────────────────
export async function sendEmail(options: {
  email: string;
  subject: string;
  message: string;
}): Promise<void> {
  const cfg = getSmtpConfig();
  if (!cfg.user || !cfg.pass) {
    console.log(`[Email skipped — SMTP not configured] To: ${options.email} | ${options.subject}`);
    return;
  }
  const transporter = nodemailer.createTransport({
    host: cfg.host, port: cfg.port, secure: cfg.secure,
    auth: { user: cfg.user, pass: cfg.pass },
  });
  try {
    await transporter.sendMail({
      from: `"PMS" <${cfg.user}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
    });
  } finally {
    transporter.close();
  }
}
