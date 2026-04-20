import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

interface AnimatedButtonProps {
  children: ReactNode;
  to?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'success' | 'outline';
  className?: string;
}

const AnimatedButton = ({ children, to, onClick, variant = 'primary', className = '' }: AnimatedButtonProps) => {
  const baseStyles = "px-8 py-4 rounded-full font-semibold transition-all duration-200 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/20",
    secondary: "bg-white text-primary border border-primary hover:bg-primary-light",
    ghost: "bg-transparent text-white border border-white/30 hover:bg-white/10",
    success: "bg-[#1D9E75] text-white hover:bg-success-dark shadow-lg shadow-success/20",
    outline: "bg-transparent border border-primary text-primary hover:bg-primary-light"
  };

  const Component = to ? Link : 'button';
  
  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      className="inline-block"
    >
      <Component
        to={to as any}
        onClick={onClick}
        className={`${baseStyles} ${variants[variant]} ${className}`}
      >
        {children}
      </Component>
    </motion.div>
  );
};

export default AnimatedButton;
