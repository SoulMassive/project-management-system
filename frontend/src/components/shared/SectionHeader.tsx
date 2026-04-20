import { motion } from 'framer-motion';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'center' | 'left';
  dark?: boolean;
}

const SectionHeader = ({ eyebrow, title, description, align = 'center', dark = false }: SectionHeaderProps) => {
  return (
    <div className={`mb-16 ${align === 'center' ? 'text-center' : 'text-left'}`}>
      {eyebrow && (
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-4 block"
        >
          {eyebrow}
        </motion.span>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className={`text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 ${
          dark ? 'text-white' : 'text-neutral-dark'
        }`}
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`max-w-2xl mx-auto text-lg leading-relaxed ${
            dark ? 'text-primary-light/70' : 'text-neutral'
          }`}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
};

export default SectionHeader;
