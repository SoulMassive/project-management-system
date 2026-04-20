import { motion } from 'framer-motion';
import Particles from './Particles';
import AnimatedButton from '../shared/AnimatedButton';

const CTABanner = () => {
  return (
    <section className="relative py-24 px-6 bg-[#26215C] overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 z-0">
        <Particles 
          color="#7F77DD" 
          quantity={30} 
          size={1.5} 
          speed={0.3} 
          opacity={0.3} 
          connectDistance={150} 
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.h2 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight"
        >
          Ready to bring order <br className="hidden md:block" /> to your projects?
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-lg md:text-xl text-primary-light/80 mb-12 max-w-2xl mx-auto"
        >
          Join 500+ teams already shipping smarter with PMS. Start free today — no credit card required.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
        >
          <AnimatedButton to="/register" variant="success" className="w-full sm:w-auto px-12 py-5 text-lg">
            Get started free →
          </AnimatedButton>
          <AnimatedButton variant="ghost" className="w-full sm:w-auto px-12 py-5 text-lg">
            Schedule a demo
          </AnimatedButton>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-primary-light/50 text-xs font-bold uppercase tracking-widest"
        >
          <span>No credit card</span>
          <span className="w-1.5 h-1.5 rounded-full bg-primary/30"></span>
          <span>Cancel anytime</span>
          <span className="w-1.5 h-1.5 rounded-full bg-primary/30"></span>
          <span>Free forever plan</span>
        </motion.div>
      </div>
      
      {/* Decorative glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-success/10 blur-[120px] rounded-full pointer-events-none"></div>
    </section>
  );
};

export default CTABanner;
