import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeader from '../shared/SectionHeader';
import { 
  HiCog8Tooth, 
  HiClipboardDocument, 
  HiCodeBracket, 
  HiMegaphone 
} from 'react-icons/hi2';

const roles = [
  {
    id: 'admin',
    name: 'Admin',
    icon: HiCog8Tooth,
    color: '#534AB7', // primary
    bg: '#EEEDFE',
    desc: 'Full control over users, billing, and system settings.',
    previewTitle: 'Control Center',
    previewDesc: 'Manage your entire workspace, monitor system activity, and configure global parameters with ease.'
  },
  {
    id: 'manager',
    name: 'Manager',
    icon: HiClipboardDocument,
    color: '#1D9E75', // success
    bg: '#E1F5EE',
    desc: 'Oversight of all projects, clients, and team performance.',
    previewTitle: 'Operations Hub',
    previewDesc: 'Keep projects on schedule, manage resource allocation, and ensure client satisfaction across the board.'
  },
  {
    id: 'developer',
    name: 'Developer',
    icon: HiCodeBracket,
    color: '#BA7517', // warning
    bg: '#FAEEDA',
    desc: 'Focus on assigned tasks, project files, and personal roadmap.',
    previewTitle: 'Developer Studio',
    previewDesc: 'A distraction-free environment for tracking your tasks, managing code-related files, and meeting deadlines.'
  },
  {
    id: 'sales',
    name: 'Sales',
    icon: HiMegaphone,
    color: '#D85A30', // danger
    bg: '#FAECE7',
    desc: 'Lead management, client profiles, and initial communications.',
    previewTitle: 'Sales CRM',
    previewDesc: 'Manage the top of your funnel. Convert leads into projects and maintain strong client relationships.'
  }
];

const RoleShowcase = () => {
  const [activeRole, setActiveRole] = useState(roles[0]);

  return (
    <section className="py-24 px-6 bg-neutral-light">
      <div className="max-w-7xl mx-auto">
        <SectionHeader 
          eyebrow="BUILT FOR EVERY ROLE"
          title="One platform, four perspectives"
          description="Tailored interfaces that provide exactly what you need to succeed, no matter your role."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Role Selection */}
          <div className="space-y-4">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => setActiveRole(role)}
                className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 flex items-center gap-6 group ${
                  activeRole.id === role.id 
                  ? 'bg-white border-primary shadow-xl scale-[1.02]' 
                  : 'bg-white/50 border-neutral-border hover:bg-white hover:border-primary/50'
                }`}
              >
                <div 
                  className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl transition-colors ${
                    activeRole.id === role.id ? 'bg-primary text-white' : 'bg-neutral-light text-neutral'
                  }`}
                  style={activeRole.id === role.id ? { backgroundColor: role.color } : {}}
                >
                  <role.icon />
                </div>
                <div className="flex-1">
                  <h3 className={`text-lg font-bold mb-1 transition-colors ${
                    activeRole.id === role.id ? 'text-neutral-dark' : 'text-neutral'
                  }`}>
                    {role.name}
                  </h3>
                  <p className="text-sm text-neutral leading-tight">{role.desc}</p>
                </div>
                {activeRole.id === role.id && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="w-1 h-10 bg-primary rounded-full"
                    style={{ backgroundColor: role.color }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Right: Preview Mockup */}
          <div className="relative h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeRole.id}
                initial={{ opacity: 0, scale: 0.95, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95, x: -20 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 bg-white rounded-3xl shadow-2xl border border-neutral-border p-8 flex flex-col"
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: activeRole.bg, color: activeRole.color }}>
                    <activeRole.icon className="w-full h-full p-2" />
                  </div>
                  <h4 className="text-xl font-bold text-neutral-dark">{activeRole.previewTitle}</h4>
                </div>

                <p className="text-neutral mb-8 leading-relaxed">
                  {activeRole.previewDesc}
                </p>

                {/* Abstract UI Mockup */}
                <div className="flex-1 bg-neutral-light rounded-xl p-6 border border-neutral-border overflow-hidden">
                   <div className="flex gap-4 mb-6">
                      <div className="w-1/3 h-4 bg-white rounded animate-pulse"></div>
                      <div className="w-1/4 h-4 bg-white rounded animate-pulse"></div>
                   </div>
                   <div className="space-y-4">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="flex items-center gap-4">
                           <div className="w-8 h-8 rounded bg-white shrink-0"></div>
                           <div className="flex-1 h-3 bg-white rounded"></div>
                           <div className="w-16 h-3 bg-white rounded"></div>
                        </div>
                      ))}
                   </div>
                   <div className="mt-8 grid grid-cols-2 gap-4">
                      <div className="h-20 bg-white rounded-lg opacity-50"></div>
                      <div className="h-20 bg-white rounded-lg opacity-50"></div>
                   </div>
                </div>

                {/* Role Specific Highlight */}
                <div className="mt-6 flex items-center justify-between">
                   <span className="text-xs font-bold text-neutral uppercase tracking-widest">Interface Preview</span>
                   <div className="flex -space-x-2">
                      {[1, 2, 3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-neutral" />)}
                   </div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* Background decorative elements */}
            <div className="absolute -z-10 -bottom-6 -right-6 w-full h-full border-2 border-primary/10 rounded-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoleShowcase;
