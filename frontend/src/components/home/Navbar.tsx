import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiSquares2X2, HiBars3, HiXMark } from 'react-icons/hi2';
import AnimatedButton from '../shared/AnimatedButton';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();
  
  const backgroundColor = useTransform(
    scrollY,
    [0, 60],
    ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.9)']
  );
  
  const borderBottom = useTransform(
    scrollY,
    [0, 60],
    ['1px solid rgba(211, 209, 199, 0)', '1px solid rgba(211, 209, 199, 1)']
  );


  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    return scrollY.on('change', (latest) => setIsScrolled(latest > 60));
  }, [scrollY]);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How it works', href: '#how-it-works' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Docs', href: '#' },
  ];

  return (
    <motion.nav
      style={{ backgroundColor, borderBottom, backdropFilter: isScrolled ? 'blur(12px)' : 'none' }}
      className="fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-6 lg:px-16 z-50 transition-all duration-200"
    >
      {/* Left: Logo */}
      <Link to="/" className="flex items-center space-x-2 group">
        <div className={`p-2 rounded-lg transition-colors ${isScrolled ? 'bg-primary text-white' : 'bg-white/20 text-white'}`}>
          <HiSquares2X2 className="text-xl" />
        </div>
        <span className={`text-xl font-bold tracking-tight transition-colors ${isScrolled ? 'text-primary' : 'text-white'}`}>
          PMS
        </span>
      </Link>

      {/* Center: Nav Links (Desktop) */}
      <div className="hidden lg:flex items-center space-x-8">
        {navLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            className={`text-sm font-medium transition-colors hover:text-primary ${isScrolled ? 'text-neutral' : 'text-white/80 hover:text-white'}`}
          >
            {link.name}
          </a>
        ))}
      </div>

      {/* Right: CTAs */}
      <div className="hidden lg:flex items-center space-x-4">
        <Link 
          to="/login" 
          className={`text-sm font-semibold transition-colors px-4 py-2 rounded-lg ${isScrolled ? 'text-neutral-dark hover:bg-neutral-light' : 'text-white hover:bg-white/10'}`}
        >
          Log in
        </Link>
        <AnimatedButton to="/register" variant="success" className="px-6 py-2 text-sm">
          Get started
        </AnimatedButton>
      </div>

      {/* Mobile Menu Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`lg:hidden p-2 rounded-lg transition-colors ${isScrolled ? 'text-neutral-dark hover:bg-neutral-light' : 'text-white hover:bg-white/10'}`}
      >
        {isOpen ? <HiXMark className="text-2xl" /> : <HiBars3 className="text-2xl" />}
      </button>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 left-0 right-0 bg-white border-b border-neutral-border p-6 shadow-xl lg:hidden flex flex-col space-y-4"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-lg font-semibold text-neutral-dark hover:text-primary"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 flex flex-col space-y-3">
              <Link to="/login" onClick={() => setIsOpen(false)} className="text-center font-bold text-neutral-dark py-3 rounded-xl bg-neutral-light">
                Log in
              </Link>
              <Link to="/register" onClick={() => setIsOpen(false)} className="text-center font-bold text-white py-3 rounded-xl bg-[#1D9E75]">
                Get started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
