import { motion } from 'framer-motion';
import Particles from './Particles';
import AnimatedButton from '../shared/AnimatedButton';
import { HiPlay } from 'react-icons/hi2';

const Hero = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: 'easeOut' as const }
  };

  return (
    <section className="relative min-h-screen bg-[#26215C] flex flex-col items-center justify-center text-center pt-32 pb-20 px-6 overflow-hidden">
      {/* Background Particles */}
      <div className="absolute inset-0 z-0">
        <Particles 
          color="#7F77DD" 
          quantity={60} 
          size={1.5} 
          speed={0.4} 
          opacity={0.5} 
          connectDistance={120} 
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Badge */}
        <motion.div 
          {...fadeInUp}
          className="inline-flex items-center bg-primary/20 border border-primary/30 text-primary-light text-xs md:text-sm rounded-full px-4 py-1.5 mb-8"
        >
          <span className="mr-2">✦</span> Now in public beta — try it free
        </motion.div>

        {/* Headline */}
        <motion.h1 
          {...fadeInUp}
          transition={{ ...fadeInUp.transition, delay: 0.1 }}
          className="text-5xl lg:text-7xl font-bold text-white leading-[1.1] mb-6"
        >
          Ship projects. <br />
          <span className="text-[#1D9E75]">Not chaos.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p 
          {...fadeInUp}
          transition={{ ...fadeInUp.transition, delay: 0.2 }}
          className="text-lg md:text-xl text-primary-light/80 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          One system for your clients, teams, tasks, and files — built specifically for agencies and dev studios who value order.
        </motion.p>

        {/* CTAs */}
        <motion.div 
          {...fadeInUp}
          transition={{ ...fadeInUp.transition, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
        >
          <AnimatedButton to="/register" variant="success" className="w-full sm:w-auto px-10 py-5 text-lg">
            Get started free →
          </AnimatedButton>
          <AnimatedButton variant="ghost" className="w-full sm:w-auto px-10 py-5 text-lg" onClick={() => {}}>
            <HiPlay className="text-xl" />
            Watch 2-min demo
          </AnimatedButton>
        </motion.div>

        {/* Social Proof */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="flex flex-wrap justify-center items-center gap-4 md:gap-8 text-primary-light/60 text-xs md:text-sm font-medium uppercase tracking-widest"
        >
          <span>500+ teams</span>
          <span className="text-primary/40 text-lg md:inline hidden">·</span>
          <span>12k+ projects</span>
          <span className="text-primary/40 text-lg md:inline hidden">·</span>
          <span>98% satisfaction</span>
        </motion.div>

        {/* Mockup Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' as const }}
          className="mt-20 relative max-w-5xl mx-auto"
        >
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' as const }}
            className="rounded-2xl border border-white/10 bg-[#2C2C2A]/80 backdrop-blur-sm p-2 shadow-2xl shadow-black/40 overflow-hidden"
          >
            {/* Browser UI Mockup */}
            <div className="bg-[#1C1C1E] rounded-xl overflow-hidden border border-white/5 flex flex-col aspect-[16/10]">
              {/* Header */}
              <div className="h-8 bg-black/40 flex items-center px-4 space-x-2">
                <div className="flex space-x-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]"></div>
                </div>
              </div>
              {/* Dashboard Layout Mockup */}
              <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <div className="w-16 md:w-48 bg-[#534AB7]/10 border-r border-white/5 p-4 hidden md:block">
                  <div className="w-full h-8 bg-white/10 rounded-lg mb-8"></div>
                  <div className="space-y-4">
                    {[1,2,3,4,5].map(i => <div key={i} className="w-full h-4 bg-white/5 rounded"></div>)}
                  </div>
                </div>
                {/* Content Area */}
                <div className="flex-1 p-6 space-y-6 overflow-hidden">
                  <div className="flex justify-between items-center">
                    <div className="w-32 h-6 bg-white/20 rounded"></div>
                    <div className="w-20 h-8 bg-[#1D9E75] rounded-lg"></div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-24 bg-white/5 rounded-xl border border-white/5"></div>
                    <div className="h-24 bg-white/5 rounded-xl border border-white/5"></div>
                    <div className="h-24 bg-white/5 rounded-xl border border-white/5"></div>
                  </div>
                  <div className="flex-1 bg-white/5 rounded-xl border border-white/5 p-4 flex gap-4 overflow-hidden">
                    <div className="w-48 h-full bg-black/20 rounded-lg flex flex-col p-3 gap-2">
                      <div className="w-1/2 h-3 bg-white/10 rounded mb-2"></div>
                      <div className="w-full h-16 bg-white/5 rounded-lg border border-white/5"></div>
                      <div className="w-full h-16 bg-white/5 rounded-lg border border-white/5"></div>
                    </div>
                    <div className="w-48 h-full bg-black/20 rounded-lg flex flex-col p-3 gap-2">
                      <div className="w-1/2 h-3 bg-white/10 rounded mb-2"></div>
                      <div className="w-full h-16 bg-white/5 rounded-lg border border-white/5"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          {/* Decorative glows */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/20 blur-[120px] rounded-full pointer-events-none"></div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#1D9E75]/20 blur-[120px] rounded-full pointer-events-none"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
