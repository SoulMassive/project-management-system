import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { HiOutlineEnvelope, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeSlash, HiOutlineBriefcase } from 'react-icons/hi2';
import { useLoginMutation } from '../features/auth/authApiSlice';
import { setCredentials } from '../features/auth/authSlice';
import { toast } from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userData = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...userData.data }));
      toast.success('Successfully logged in!');
      navigate('/');
    } catch (err: any) {
      toast.error(err?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-light px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl shadow-xl shadow-primary/20 mb-4 animate-bounce">
            <HiOutlineBriefcase className="text-white text-3xl" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-dark">Welcome Back</h1>
          <p className="text-neutral mt-2">Sign in to manage your projects</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-neutral-dark/5 border border-[#D3D1C7]">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-neutral-dark mb-2">Email Address</label>
              <div className="relative">
                <HiOutlineEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral text-xl" />
                <input
                  type="email"
                  required
                  value={email}
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
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-neutral-light border-none rounded-xl pl-12 pr-12 py-3 text-neutral-dark focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral hover:text-primary transition-colors"
                >
                  {showPassword ? <HiOutlineEyeSlash className="text-xl" /> : <HiOutlineEye className="text-xl" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <div className={`w-5 h-5 border-2 rounded-md transition-all ${rememberMe ? 'bg-primary border-primary' : 'border-neutral group-hover:border-primary'}`}>
                    {rememberMe && <div className="absolute inset-0 flex items-center justify-center text-white text-xs">✓</div>}
                  </div>
                </div>
                <span className="text-sm font-medium text-neutral">Remember me</span>
              </label>
              <button type="button" className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-neutral-light text-center text-sm text-neutral">
            Don't have an account? <Link to="/register" className="font-bold text-primary hover:border-b border-primary">Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
