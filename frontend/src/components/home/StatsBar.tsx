import { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useCountUp } from '../../hooks/useCountUp';

interface StatItemProps {
  target: number;
  suffix?: string;
  label: string;
  isLast?: boolean;
}

const StatItem = ({ target, suffix = '', label, isLast = false }: StatItemProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const { count, start } = useCountUp(target);

  useEffect(() => {
    if (isInView) {
      start();
    }
  }, [isInView, start]);

  return (
    <div 
      ref={ref}
      className={`flex flex-col items-center justify-center py-10 md:py-16 px-8 ${
        !isLast ? 'md:border-r border-neutral-border' : ''
      }`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="text-4xl md:text-5xl font-bold text-primary mb-2"
      >
        {count.toLocaleString()}{suffix}
      </motion.div>
      <div className="text-sm md:text-base font-medium text-neutral uppercase tracking-widest text-center">
        {label}
      </div>
    </div>
  );
};

const StatsBar = () => {
  const stats = [
    { target: 500, suffix: '+', label: 'Teams using PMS' },
    { target: 12000, suffix: '+', label: 'Projects delivered' },
    { target: 98, suffix: '%', label: 'Client satisfaction' },
  ];

  return (
    <div className="bg-white border-y border-neutral-border overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3">
        {stats.map((stat, index) => (
          <StatItem 
            key={index} 
            target={stat.target} 
            suffix={stat.suffix} 
            label={stat.label} 
            isLast={index === stats.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

export default StatsBar;
