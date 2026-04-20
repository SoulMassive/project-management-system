import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiCheckCircle } from 'react-icons/hi2';
import AnimatedButton from '../shared/AnimatedButton';

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  const plans = [
    {
      name: 'Starter',
      price: billingCycle === 'monthly' ? '0' : '0',
      desc: 'Perfect for freelancers getting started.',
      features: ['Up to 3 projects', '2 team members', '1 client profile', '500MB storage', 'Basic task board'],
      cta: 'Start free',
      variant: 'outline' as const,
      featured: false
    },
    {
      name: 'Pro',
      price: billingCycle === 'monthly' ? '999' : '799',
      desc: 'The best for growing agencies and studios.',
      features: ['Unlimited projects', 'Unlimited clients', '10 team members', '10GB storage', 'Priority support', 'Audit logs'],
      cta: 'Start Pro trial',
      variant: 'primary' as const,
      featured: true,
      badge: 'Most Popular'
    },
    {
      name: 'Agency',
      price: billingCycle === 'monthly' ? '2,499' : '1,999',
      desc: 'Full-scale solution for larger organizations.',
      features: ['Everything in Pro', 'Unlimited team members', '100GB storage', 'Custom branding', 'Dedicated manager', 'API access'],
      cta: 'Contact sales',
      variant: 'outline' as const,
      featured: false,
      success: true
    }
  ];

  return (
    <section id="pricing" className="py-24 px-6 bg-neutral-light">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-dark mb-4">Simple, honest pricing</h2>
          <p className="text-neutral text-lg">Start free. Scale as your team grows.</p>

          {/* Billing Toggle */}
          <div className="mt-10 flex items-center justify-center gap-4">
            <span className={`text-sm font-semibold transition-colors ${billingCycle === 'monthly' ? 'text-primary' : 'text-neutral'}`}>Monthly</span>
            <button 
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className="w-16 h-8 bg-neutral-border rounded-full p-1 relative transition-colors hover:bg-neutral"
            >
              <motion.div 
                animate={{ x: billingCycle === 'monthly' ? 0 : 32 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="w-6 h-6 bg-white rounded-full shadow-sm"
              />
            </button>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-semibold transition-colors ${billingCycle === 'annual' ? 'text-primary' : 'text-neutral'}`}>Annual</span>
              <span className="bg-success-light text-success text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">Save 20%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className={`relative bg-white rounded-3xl p-10 border transition-all duration-300 ${
                plan.featured ? 'border-primary shadow-2xl scale-105 z-10' : 'border-neutral-border shadow-sm hover:shadow-xl'
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">
                  {plan.badge}
                </div>
              )}

              <h3 className="text-xl font-bold text-neutral-dark mb-2">{plan.name}</h3>
              <p className="text-neutral text-sm mb-8 leading-relaxed h-10">{plan.desc}</p>
              
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-bold text-neutral-dark">₹{plan.price}</span>
                <span className="text-neutral text-sm">/mo</span>
              </div>

              <div className="space-y-4 mb-10">
                {plan.features.map((feature, fIndex) => (
                  <div key={fIndex} className="flex items-start gap-3">
                    <HiCheckCircle className="text-success text-xl shrink-0 mt-0.5" />
                    <span className="text-sm text-neutral-dark font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <AnimatedButton 
                to={plan.success ? '#' : '/register'}
                variant={plan.variant} 
                className={`w-full py-4 ${plan.success ? 'border-success text-success hover:bg-success-light' : ''}`}
              >
                {plan.cta}
              </AnimatedButton>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
