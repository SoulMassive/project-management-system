import { motion, useScroll, useSpring } from 'framer-motion';
import { useRef } from 'react';
import SectionHeader from '../shared/SectionHeader';

const steps = [
  {
    title: 'Add your client',
    desc: 'Create a client profile with contact details, GST info, and billing preferences.',
    color: '#534AB7', // primary
    light: '#EEEDFE'
  },
  {
    title: 'Create a project',
    desc: 'Link it to a client, set type, dates, budget, and assign your team members.',
    color: '#1D9E75', // success
    light: '#E1F5EE'
  },
  {
    title: 'Break into tasks',
    desc: 'Create tasks, add subtasks, set deadlines, assign developers. Kanban view ready.',
    color: '#BA7517', // warning
    light: '#FAEEDA'
  },
  {
    title: 'Ship and maintain',
    desc: 'Move through stages to Live. File uploads, communication logs preserved.',
    color: '#1D9E75', // success
    light: '#E1F5EE'
  }
];

const HowItWorks = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const pathLength = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <section id="how-it-works" className="py-24 px-6 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto" ref={containerRef}>
        <SectionHeader 
          eyebrow="SIMPLE ONBOARDING"
          title="Up and running in minutes"
          description="A streamlined workflow designed to get your team moving without the complexity."
        />

        <div className="relative mt-20">
          {/* SVG Connector Line (Desktop) */}
          <div className="absolute top-10 left-0 w-full hidden lg:block px-20">
            <svg width="100%" height="20" viewBox="0 0 800 20" fill="none" className="overflow-visible">
              <motion.path
                d="M 0 10 L 800 10"
                stroke="#D3D1C7"
                strokeWidth="2"
                strokeDasharray="10 10"
              />
              <motion.path
                d="M 0 10 L 800 10"
                stroke="#534AB7"
                strokeWidth="3"
                style={{ pathLength }}
              />
            </svg>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center text-center group"
              >
                {/* Step Number Circle */}
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold mb-8 transition-transform group-hover:scale-110 shadow-lg border-4 border-white"
                  style={{ backgroundColor: step.light, color: step.color, boxShadow: `0 10px 30px -10px ${step.color}40` }}
                >
                  {index + 1}
                </div>
                
                <h3 className="text-xl font-bold text-neutral-dark mb-3">{step.title}</h3>
                <p className="text-neutral text-sm leading-relaxed max-w-[240px]">
                  {step.desc}
                </p>

                {/* Mobile Connector */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden w-0.5 h-12 bg-neutral-border mt-8"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
