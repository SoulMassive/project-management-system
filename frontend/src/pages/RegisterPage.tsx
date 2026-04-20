import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { 
  HiOutlineEnvelope, 
  HiOutlineLockClosed, 
  HiOutlineEye, 
  HiOutlineEyeSlash, 
  HiOutlineBriefcase,
  HiOutlineUser,
  HiOutlineBuildingOffice2
} from 'react-icons/hi2';
import { useRegisterMutation } from '../features/auth/authApiSlice';
import { setCredentials } from '../features/auth/authSlice';
import { toast } from 'react-hot-toast';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [register, { isLoading }] = useRegisterMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    if (!agreeTerms) {
      return toast.error('Please agree to the Terms of Service');
    }

    try {
      const userData = await register({ 
        name: formData.name, 
        email: formData.email, 
        password: formData.password,
        company: formData.company
      }).unwrap();
      
      dispatch(setCredentials({ ...userData.data }));
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-light px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl shadow-xl shadow-primary/20 mb-4 animate-pulse">
            <HiOutlineBriefcase className="text-white text-3xl" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-dark">Create Account</h1>
          <p className="text-neutral mt-2">Join us to streamline your project management</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-neutral-dark/5 border border-[#D3D1C7]">
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-neutral-dark mb-2">Full Name</label>
              <div className="relative">
                <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral text-xl" />
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full bg-neutral-light border-none rounded-xl pl-12 pr-4 py-3 text-neutral-dark focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-dark mb-2">Email Address</label>
              <div className="relative">
                <HiOutlineEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral text-xl" />
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  className="w-full bg-neutral-light border-none rounded-xl pl-12 pr-4 py-3 text-neutral-dark focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-dark mb-2">Company Name</label>
              <div className="relative">
                <HiOutlineBuildingOffice2 className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral text-xl" />
                <input
                  name="company"
                  type="text"
                  required
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Acme Inc."
                  className="w-full bg-neutral-light border-none rounded-xl pl-12 pr-4 py-3 text-neutral-dark focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-dark mb-2">Password</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral text-xl" />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
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

            <div>
              <label className="block text-sm font-semibold text-neutral-dark mb-2">Confirm Password</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral text-xl" />
                <input
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-neutral-light border-none rounded-xl pl-12 pr-4 py-3 text-neutral-dark focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={agreeTerms}
                  onChange={() => setAgreeTerms(!agreeTerms)}
                />
                <div className={`w-5 h-5 border-2 rounded-md transition-all ${agreeTerms ? 'bg-primary border-primary' : 'border-neutral group-hover:border-primary'}`}>
                  {agreeTerms && <div className="absolute inset-0 flex items-center justify-center text-white text-xs">✓</div>}
                </div>
              </div>
              <span className="text-sm font-medium text-neutral">
                I agree to the <button type="button" className="text-primary hover:underline">Terms of Service</button>
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0"
            >
              {isLoading ? 'Creating Account...' : 'Get Started'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-neutral-light text-center text-sm text-neutral">
            Already have an account? <Link to="/login" className="font-bold text-primary hover:border-b border-primary">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
