/**
 * OtpInput — 6-box individual digit input.
 * Auto-advances on digit entry, auto-retreats on backspace.
 * Handles paste of full 6-digit codes.
 */
import { useRef, useState, useEffect } from 'react';

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  error?: boolean;
}

const OtpInput = ({ length = 6, value, onChange, disabled, error }: OtpInputProps) => {
  const [digits, setDigits] = useState<string[]>(Array(length).fill(''));
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  // Sync external value → internal state (e.g. clearing on error)
  useEffect(() => {
    const arr = value.split('').slice(0, length);
    while (arr.length < length) arr.push('');
    setDigits(arr);
  }, [value, length]);

  const propagate = (arr: string[]) => {
    onChange(arr.join(''));
  };

  const handleChange = (idx: number, char: string) => {
    const digit = char.replace(/\D/g, '').slice(-1); // only one numeric char
    const next = [...digits];
    next[idx] = digit;
    setDigits(next);
    propagate(next);
    if (digit && idx < length - 1) {
      inputs.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (digits[idx]) {
        // Clear current
        const next = [...digits];
        next[idx] = '';
        setDigits(next);
        propagate(next);
      } else if (idx > 0) {
        // Move to previous
        inputs.current[idx - 1]?.focus();
        const next = [...digits];
        next[idx - 1] = '';
        setDigits(next);
        propagate(next);
      }
    }
    if (e.key === 'ArrowLeft' && idx > 0) inputs.current[idx - 1]?.focus();
    if (e.key === 'ArrowRight' && idx < length - 1) inputs.current[idx + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    const next = Array(length).fill('');
    pasted.split('').forEach((c, i) => { next[i] = c; });
    setDigits(next);
    propagate(next);
    // Focus last filled or the next empty box
    const focusIdx = Math.min(pasted.length, length - 1);
    inputs.current[focusIdx]?.focus();
  };

  return (
    <div className="flex gap-3 justify-center" onPaste={handlePaste}>
      {digits.map((digit, idx) => (
        <input
          key={idx}
          ref={(el) => { inputs.current[idx] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(idx, e.target.value)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          onFocus={(e) => e.target.select()}
          className={[
            'w-12 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all duration-150',
            'focus:scale-105 focus:shadow-lg',
            disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'bg-white cursor-text',
            error
              ? 'border-red-400 text-red-600 bg-red-50 animate-shake'
              : digit
              ? 'border-[#534AB7] text-[#534AB7] shadow-md shadow-[#534AB7]/10'
              : 'border-[#D3D1C7] text-neutral-800 hover:border-[#534AB7]/40',
          ].join(' ')}
        />
      ))}
    </div>
  );
};

export default OtpInput;
