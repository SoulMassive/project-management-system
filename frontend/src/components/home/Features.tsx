import { motion } from 'framer-motion';
import SectionHeader from '../shared/SectionHeader';
import TiltCard from './TiltCard';
import { 
  HiShieldCheck, 
  HiArrowTrendingUp, 
  HiViewColumns, 
  HiUserGroup, 
  HiFolderOpen, 
  HiClipboardDocumentList 
} from 'react-icons/hi2';

const features = [
  {
    title: 'Role-based access',
    desc: 'Admin, Manager, Developer, Sales — each sees only what they need. Fully configurable permissions.',
    icon: HiShieldCheck,
    color: 'primary',
    accent: '#534AB7',
    light: '#EEEDFE'
  },
  {
    title: 'Project pipeline',
    desc: 'Track every project from Lead to Maintenance with a visual stage stepper and status dashboard.',
    icon: HiArrowTrendingUp,
    color: 'success',
    accent: '#1D9E75',
    light: '#E1F5EE'
  },
  {
    title: 'Kanban task board',
    desc: 'Drag-and-drop tasks across To Do, Doing, Review, and Done. Dependencies and subtasks included.',
    icon: HiViewColumns,
    color: 'warning',
    accent: '#BA7517',
    light: '#FAEEDA'
  },
  {
    title: 'Client management',
    desc: 'Full client profiles with GST billing, communication history, and linked project views in one place.',
    icon: HiUserGroup,
    color: 'info',
    accent: '#378ADD',
    light: '#E6F1FB'
  },
  {
    title: 'File storage',
    desc: 'Upload contracts, designs, and credentials. Version history, folder structure, role-restricted.',
    icon: HiFolderOpen,
    color: 'danger',
    accent: '#D85A30',
    light: '#FAECE7'
  },
  {
    title: 'Activity log',
    desc: 'Every action tracked. Know who changed what, and when — full audit trail for your team.',
    icon: HiClipboardDocumentList,
    color: 'primary',
    accent: '#534AB7',
    light: '#EEEDFE'
  }
];

const Features = () => {
  return (
    <section id="features" className="py-24 px-6 bg-neutral-light">
      <div className="max-w-7xl mx-auto">
        <SectionHeader 
          eyebrow="BUILT FOR AGENCIES"
          title="Everything your team needs"
          description="From first client contact to final delivery — one platform, zero confusion."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <TiltCard className="h-full">
                <div className="bg-white rounded-2xl p-8 border border-neutral-border border-t-4 h-full shadow-sm hover:shadow-xl transition-shadow" style={{ borderTopColor: feature.accent }}>
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: feature.light, color: feature.accent }}
                  >
                    <feature.icon className="text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-dark mb-4">{feature.title}</h3>
                  <p className="text-neutral leading-relaxed text-sm">
                    {feature.desc}
                  </p>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
