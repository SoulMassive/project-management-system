import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineBriefcase,
  HiOutlineShieldCheck,
  HiOutlineArrowLeft,
  HiOutlineArrowPath,
} from 'react-icons/hi2';
import {
  useLoginMutation,
  useSendOtpMutation,
  useLoginOtpMutation,
} from '../features/auth/authApiSlice';
import { setCredentials } from '../features/auth/authSlice';
import { toast } from 'react-hot-toast';
import OtpInput from '../components/ui/OtpInput';

type Mode = 'password' | 'otp';
type OtpStep = 'email' | 'verify';

const RESEND_COOLDOWN = 60; // seconds

const LoginPage = () => {
  // ── State ────────────────────────────────────────────────────────────────
  const [mode, setMode] = useState<Mode>('otp'); // default to OTP login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otpStep, setOtpStep] = useState<OtpStep>('email');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── RTK mutations ─────────────────────────────────────────────────────
  const [login, { isLoading: pwLoading }] = useLoginMutation();
  const [sendOtp, { isLoading: sendLoading }] = useSendOtpMutation();
  const [loginOtp, { isLoading: verifyLoading }] = useLoginOtpMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ── Cleanup timer ─────────────────────────────────────────────────────
  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  // ── Helpers ───────────────────────────────────────────────────────────
  const startCountdown = (seconds = RESEND_COOLDOWN) => {
    setCountdown(seconds);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(timerRef.current!); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  // ── Handlers ──────────────────────────────────────────────────────────
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userData = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...userData.data }));
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err?.data?.error || 'Login failed');
    }
  };

  const handleSendOtp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!email.trim()) return toast.error('Please enter your email');

    try {
      const res = await sendOtp({ email: email.trim(), purpose: 'login' }).unwrap();
      toast.success(res.message || 'OTP sent to your email!');
      setOtpStep('verify');
      setOtp('');
      startCountdown();
    } catch (err: any) {
      toast.error(err?.data?.error || 'Failed to send OTP');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) return toast.error('Please enter the 6-digit OTP');

    try {
      const userData = await loginOtp({ email: email.trim(), otp }).unwrap();
      dispatch(setCredentials({ ...userData.data }));
      toast.success('Verified! Welcome back 🎉');
      navigate('/dashboard');
    } catch (err: any) {
      setOtpError(true);
      setOtp('');
      setTimeout(() => setOtpError(false), 600);
      toast.error(err?.data?.error || 'Invalid OTP');
    }
  };

  const handleResend = () => {
    if (countdown > 0) return;
    handleSendOtp();
  };

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-light px-4">
      <div className="max-w-md w-full">

        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl shadow-xl shadow-primary/20 mb-4 animate-bounce">
            <HiOutlineBriefcase className="text-white text-3xl" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-dark">Welcome Back</h1>
          <p className="text-neutral mt-2">Sign in to manage your projects</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-neutral-dark/5 border border-[#D3D1C7] overflow-hidden">

          {/* Mode Toggle */}
          <div className="flex border-b border-[#D3D1C7]">
            {(['otp', 'password'] as Mode[]).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setOtpStep('email'); setOtp(''); }}
                className={`flex-1 py-4 text-sm font-bold transition-all ${
                  mode === m
                    ? 'text-primary border-b-2 border-primary bg-primary/5'
                    : 'text-neutral hover:bg-neutral-light/50'
                }`}
              >
                {m === 'otp' ? '✉️ OTP Login' : '🔑 Password Login'}
              </button>
            ))}
          </div>

          <div className="p-8">

            {/* ── PASSWORD MODE ────────────────────────────────────────── */}
            {mode === 'password' && (
              <form onSubmit={handlePasswordLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-neutral-dark mb-2">Email Address</label>
                  <div className="relative">
                    <HiOutlineEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral text-xl" />
                    <input
                      type="email" required value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full bg-neutral-light border-none rounded-xl pl-12 pr-4 py-3 text-neutral-dark focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-dark mb-2">Password</label>
                  <div className="relative">
                    <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral text-xl" />
                    <input
                      type={showPassword ? 'text' : 'password'} required
                      value={password} onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-neutral-light border-none rounded-xl pl-12 pr-12 py-3 text-neutral-dark focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral hover:text-primary transition-colors">
                      {showPassword ? <HiOutlineEyeSlash className="text-xl" /> : <HiOutlineEye className="text-xl" />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={pwLoading}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0">
                  {pwLoading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>
            )}

            {/* ── OTP MODE — STEP 1: Email ─────────────────────────────── */}
            {mode === 'otp' && otpStep === 'email' && (
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div className="text-center p-4 bg-primary/5 rounded-2xl border border-primary/10">
                  <HiOutlineShieldCheck className="text-3xl text-primary mx-auto mb-2" />
                  <p className="text-sm text-neutral font-medium">
                    We'll send a <strong>6-digit OTP</strong> to your email — no password needed.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-dark mb-2">Email Address</label>
                  <div className="relative">
                    <HiOutlineEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral text-xl" />
                    <input
                      type="email" required value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full bg-neutral-light border-none rounded-xl pl-12 pr-4 py-3 text-neutral-dark focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    />
                  </div>
                </div>

                <button type="submit" disabled={sendLoading}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0">
                  {sendLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <HiOutlineArrowPath className="animate-spin text-xl" /> Sending OTP...
                    </span>
                  ) : 'Send OTP →'}
                </button>
              </form>
            )}

            {/* ── OTP MODE — STEP 2: Verify ────────────────────────────── */}
            {mode === 'otp' && otpStep === 'verify' && (
              <form onSubmit={handleVerifyOtp} className="space-y-6">

                {/* Header with back button */}
                <div className="flex items-center gap-3 mb-2">
                  <button type="button" onClick={() => { setOtpStep('email'); setOtp(''); }}
                    className="p-2 rounded-lg hover:bg-neutral-light transition-colors text-neutral hover:text-primary">
                    <HiOutlineArrowLeft className="text-xl" />
                  </button>
                  <div>
                    <p className="font-bold text-neutral-dark text-sm">Enter your OTP</p>
                    <p className="text-xs text-neutral">Sent to <span className="font-semibold text-primary">{email}</span></p>
                  </div>
                </div>

                {/* OTP boxes */}
                <div className="py-4">
                  <OtpInput value={otp} onChange={setOtp} error={otpError} disabled={verifyLoading} />
                </div>

                {/* Countdown / resend */}
                <div className="text-center text-sm text-neutral">
                  {countdown > 0 ? (
                    <p>Resend OTP in <span className="font-bold text-primary tabular-nums">{countdown}s</span></p>
                  ) : (
                    <button type="button" onClick={handleResend} disabled={sendLoading}
                      className="font-bold text-primary hover:text-primary-dark transition-colors flex items-center gap-1.5 mx-auto disabled:opacity-50">
                      <HiOutlineArrowPath className={sendLoading ? 'animate-spin' : ''} />
                      {sendLoading ? 'Sending...' : 'Resend OTP'}
                    </button>
                  )}
                </div>

                <button type="submit" disabled={verifyLoading || otp.length < 6}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0">
                  {verifyLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <HiOutlineArrowPath className="animate-spin text-xl" /> Verifying...
                    </span>
                  ) : 'Verify & Sign In'}
                </button>
              </form>
            )}

          </div>

          {/* Footer */}
          <div className="px-8 pb-8 text-center text-sm text-neutral">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-primary hover:border-b border-primary">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
