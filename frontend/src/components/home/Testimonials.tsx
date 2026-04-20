import SectionHeader from '../shared/SectionHeader';
import { HiStar } from 'react-icons/hi2';

const testimonials = [
  {
    quote: "Cut our project chaos by half in two weeks. The stage pipeline alone is worth it.",
    author: "Arjun R.",
    title: "CTO, Pixelcraft Studios",
    initials: "AR"
  },
  {
    quote: "Clients love getting a direct view of where their project stands. No more weekly status calls.",
    author: "Priya K.",
    title: "PM, BuildStack Agency",
    initials: "PK"
  },
  {
    quote: "The kanban + file storage combo is unmatched. Everything we need, nothing we don't.",
    author: "Sneha M.",
    title: "Dev Lead, Nexora Tech",
    initials: "SM"
  },
  {
    quote: "Role-based access means our sales team can update leads without touching anything else.",
    author: "Rahul D.",
    title: "Founder, CreativeLoop",
    initials: "RD"
  },
  {
    quote: "Activity logs saved us during a client dispute. Every action timestamped. Brilliant feature.",
    author: "Divya P.",
    title: "Operations, StudioForge",
    initials: "DP"
  },
  {
    quote: "We onboarded our entire team of 18 in one afternoon. The UI is that intuitive.",
    author: "Karthik S.",
    title: "CTO, Branzera",
    initials: "KS"
  }
];

const TestimonialCard = ({ testimonial }: { testimonial: typeof testimonials[0] }) => (
  <div className="bg-white rounded-2xl border border-neutral-border p-8 min-w-[350px] mx-4 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex gap-1 mb-4 text-[#BA7517]">
      {[1, 2, 3, 4, 5].map(i => <HiStar key={i} />)}
    </div>
    <p className="text-neutral-dark text-base leading-relaxed italic mb-8">
      "{testimonial.quote}"
    </p>
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-primary-light text-primary flex items-center justify-center font-bold">
        {testimonial.initials}
      </div>
      <div>
        <h4 className="font-bold text-neutral-dark text-sm">{testimonial.author}</h4>
        <p className="text-neutral text-xs">{testimonial.title}</p>
      </div>
    </div>
  </div>
);

const Testimonials = () => {
  // Duplicate testimonials for seamless loop
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <SectionHeader 
          eyebrow="TRUSTED BY TEAMS"
          title="Loved by agencies across India"
        />
      </div>

      {/* Marquee Row 1 */}
      <div className="flex relative overflow-hidden group">
        <div className="flex animate-marquee-slow group-hover:pause-animation">
          {duplicatedTestimonials.map((t, i) => (
            <TestimonialCard key={i} testimonial={t} />
          ))}
        </div>
      </div>

      {/* Marquee Row 2 (Reverse) */}
      <div className="flex relative overflow-hidden mt-8 group">
        <div className="flex animate-marquee-reverse-slow group-hover:pause-animation">
          {duplicatedTestimonials.map((t, i) => (
            <TestimonialCard key={i} testimonial={t} />
          ))}
        </div>
      </div>

      {/* CSS for Marquee - I'll add this to index.css or a style tag */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-slow {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee-reverse-slow {
          animation: marquee 45s linear infinite reverse;
        }
        .pause-animation {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default Testimonials;
