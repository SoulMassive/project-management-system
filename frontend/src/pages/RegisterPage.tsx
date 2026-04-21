import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineBriefcase,
  HiOutlineUser,
  HiOutlineBuildingOffice2,
  HiOutlineShieldCheck,
  HiOutlineArrowLeft,
  HiOutlineArrowPath,
  HiOutlineCheckCircle,
} from 'react-icons/hi2';
import {
  useSendOtpMutation,
  useRegisterOtpMutation,
} from '../features/auth/authApiSlice';
import { setCredentials } from '../features/auth/authSlice';
import { toast } from 'react-hot-toast';
import OtpInput from '../components/ui/OtpInput';

type Step = 'form' | 'otp';
const RESEND_COOLDOWN = 60;

const RegisterPage = () => {
  // ── Form state ──────────────────────────────────────────────────────────────
  const [step, setStep] = useState<Step>('form');
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', company: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // ── OTP state ───────────────────────────────────────────────────────────────
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Mutations ───────────────────────────────────────────────────────────────
  const [sendOtp, { isLoading: sendLoading }] = useSendOtpMutation();
  const [registerOtp, { isLoading: registerLoading }] = useRegisterOtpMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const startCountdown = (s = RESEND_COOLDOWN) => {
    setCountdown(s);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(timerRef.current!); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ── Step 1: Validate form + send OTP ────────────────────────────────────────
  const handleSendOtp = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    if (formData.password.length < 8) {
      return toast.error('Password must be at least 8 characters');
    }
    if (!agreeTerms) {
      return toast.error('Please agree to the Terms of Service');
    }

    try {
      const res = await sendOtp({ email: formData.email.trim(), purpose: 'register' }).unwrap();
      toast.success(res.message || 'OTP sent to your email!');
      setStep('otp');
      setOtp('');
      startCountdown();
    } catch (err: any) {
      toast.error(err?.data?.error || 'Failed to send OTP');
    }
  };

  // ── Step 2: Verify OTP + create account ─────────────────────────────────────
  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) return toast.error('Please enter the 6-digit OTP');

    try {
      const userData = await registerOtp({
        name: formData.name,
        email: formData.email.trim(),
        password: formData.password,
        otp,
        company: formData.company || undefined,
      }).unwrap();

      dispatch(setCredentials({ ...userData.data }));
      toast.success('Account created! Welcome to PMS 🚀');
      navigate('/dashboard');
    } catch (err: any) {
      setOtpError(true);
      setOtp('');
      setTimeout(() => setOtpError(false), 600);
      toast.error(err?.data?.error || 'Verification failed');
    }
  };

  const handleResend = () => {
    if (countdown > 0) return;
    handleSendOtp();
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-light px-4 py-12">
      <div className="max-w-md w-full">

        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl shadow-xl shadow-primary/20 mb-4 animate-pulse">
            <HiOutlineBriefcase className="text-white text-3xl" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-dark">Create Account</h1>
          <p className="text-neutral mt-2">Verified with OTP — fast and secure</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-8 px-2">
          {['Account Details', 'Verify Email'].map((label, idx) => {
            const stepNum = idx + 1;
            const isActive = (step === 'form' && stepNum === 1) || (step === 'otp' && stepNum === 2);
            const isDone = step === 'otp' && stepNum === 1;
            return (
              <div key={idx} className="flex items-center gap-2 flex-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isDone ? 'bg-[#1D9E75] text-white' :
                  isActive ? 'bg-primary text-white ring-4 ring-primary/20' :
                  'bg-[#D3D1C7] text-neutral'
                }`}>
                  {isDone ? <HiOutlineCheckCircle /> : stepNum}
                </div>
                <span className={`text-xs font-semibold ${isActive ? 'text-primary' : isDone ? 'text-[#1D9E75]' : 'text-neutral'}`}>
                  {label}
                </span>
                {idx === 0 && (
                  <div className={`flex-1 h-0.5 rounded-full transition-all ${step === 'otp' ? 'bg-primary' : 'bg-[#D3D1C7]'}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Card */}
        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-neutral-dark/5 border border-[#D3D1C7]">

          {/* ── STEP 1: Registration Form ──────────────────────────────────── */}
          {step === 'form' && (
            <form onSubmit={handleSendOtp} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-neutral-dark mb-2">Full Name</label>
                <div className="relative">
                  <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral text-xl" />
                  <input name="name" type="text" required value={formData.name} onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full bg-neutral-light border-none rounded-xl pl-12 pr-4 py-3 text-neutral-dark focus:ring-2 focus:ring-primary/20 transition-all outline-none" />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-neutral-dark mb-2">Email Address</label>
                <div className="relative">
                  <HiOutlineEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral text-xl" />
                  <input name="email" type="email" required value={formData.email} onChange={handleChange}
                    placeholder="name@company.com"
                    className="w-full bg-neutral-light border-none rounded-xl pl-12 pr-4 py-3 text-neutral-dark focus:ring-2 focus:ring-primary/20 transition-all outline-none" />
                </div>
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-semibold text-neutral-dark mb-2">Company <span className="text-neutral font-normal">(optional)</span></label>
                <div className="relative">
                  <HiOutlineBuildingOffice2 className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral text-xl" />
                  <input name="company" type="text" value={formData.company} onChange={handleChange}
                    placeholder="Acme Inc."
                    className="w-full bg-neutral-light border-none rounded-xl pl-12 pr-4 py-3 text-neutral-dark focus:ring-2 focus:ring-primary/20 transition-all outline-none" />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-neutral-dark mb-2">Password</label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral text-xl" />
                  <input name="password" type={showPassword ? 'text' : 'password'} required
                    value={formData.password} onChange={handleChange} placeholder="min. 8 characters"
                    className="w-full bg-neutral-light border-none rounded-xl pl-12 pr-12 py-3 text-neutral-dark focus:ring-2 focus:ring-primary/20 transition-all outline-none" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral hover:text-primary transition-colors">
                    {showPassword ? <HiOutlineEyeSlash className="text-xl" /> : <HiOutlineEye className="text-xl" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-neutral-dark mb-2">Confirm Password</label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral text-xl" />
                  <input name="confirmPassword" type={showPassword ? 'text' : 'password'} required
                    value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••"
                    className="w-full bg-neutral-light border-none rounded-xl pl-12 pr-4 py-3 text-neutral-dark focus:ring-2 focus:ring-primary/20 transition-all outline-none" />
                </div>
              </div>

              {/* Terms */}
              <label className="flex items-center space-x-3 cursor-pointer group">
                <div className="relative shrink-0" onClick={() => setAgreeTerms(!agreeTerms)}>
                  <input type="checkbox" className="sr-only" checked={agreeTerms} readOnly />
                  <div className={`w-5 h-5 border-2 rounded-md transition-all ${agreeTerms ? 'bg-primary border-primary' : 'border-neutral group-hover:border-primary'}`}>
                    {agreeTerms && <div className="absolute inset-0 flex items-center justify-center text-white text-xs">✓</div>}
                  </div>
                </div>
                <span className="text-sm font-medium text-neutral">
                  I agree to the <button type="button" className="text-primary hover:underline">Terms of Service</button>
                </span>
              </label>

              <button type="submit" disabled={sendLoading}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0">
                {sendLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <HiOutlineArrowPath className="animate-spin text-xl" /> Sending OTP...
                  </span>
                ) : 'Continue → Verify Email'}
              </button>
            </form>
          )}

          {/* ── STEP 2: OTP Verification ──────────────────────────────────── */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyAndRegister} className="space-y-6">

              {/* Header */}
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => { setStep('form'); setOtp(''); }}
                  className="p-2 rounded-lg hover:bg-neutral-light transition-colors text-neutral hover:text-primary">
                  <HiOutlineArrowLeft className="text-xl" />
                </button>
                <div>
                  <p className="font-bold text-neutral-dark text-sm">Verify your email</p>
                  <p className="text-xs text-neutral">OTP sent to <span className="font-semibold text-primary">{formData.email}</span></p>
                </div>
              </div>

              {/* Shield icon */}
              <div className="text-center p-4 bg-primary/5 rounded-2xl border border-primary/10">
                <HiOutlineShieldCheck className="text-4xl text-primary mx-auto mb-2" />
                <p className="text-sm text-neutral font-medium">
                  Enter the <strong>6-digit code</strong> to activate your account
                </p>
              </div>

              {/* OTP Boxes */}
              <div className="py-2">
                <OtpInput value={otp} onChange={setOtp} error={otpError} disabled={registerLoading} />
              </div>

              {/* Resend */}
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

              <button type="submit" disabled={registerLoading || otp.length < 6}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0">
                {registerLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <HiOutlineArrowPath className="animate-spin text-xl" /> Creating Account...
                  </span>
                ) : 'Verify & Create Account 🚀'}
              </button>
            </form>
          )}
        </div>

        <div className="mt-6 text-center text-sm text-neutral">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-primary hover:border-b border-primary">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
