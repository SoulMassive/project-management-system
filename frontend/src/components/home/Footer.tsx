import { Link } from 'react-router-dom';
import { HiSquares2X2, HiGlobeAlt } from 'react-icons/hi2';
import { FiLinkedin, FiTwitter, FiGithub } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Product',
      links: [
        { name: 'Features', href: '#features' },
        { name: 'Pricing', href: '#pricing' },
        { name: 'Changelog', href: '#' },
        { name: 'Roadmap', href: '#' },
        { name: 'Security', href: '#' }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About', href: '#' },
        { name: 'Blog', href: '#' },
        { name: 'Careers', href: '#' },
        { name: 'Press', href: '#' },
        { name: 'Contact', href: '#' }
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '#' },
        { name: 'Community', href: '#' },
        { name: 'Status', href: '#' },
        { name: 'Privacy Policy', href: '#' },
        { name: 'Terms of Service', href: '#' }
      ]
    }
  ];

  return (
    <footer className="bg-[#2C2C2A] text-white pt-20 pb-10 px-6 lg:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
          {/* Brand Col */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-6 group">
              <div className="p-2 rounded-lg bg-primary text-white group-hover:scale-110 transition-transform">
                <HiSquares2X2 className="text-2xl" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                PMS
              </span>
            </Link>
            <p className="text-neutral text-base max-w-sm mb-8 leading-relaxed">
              The all-in-one project management system built specifically for modern agencies and development studios. Ship projects, not chaos.
            </p>
            <div className="flex items-center gap-4">
              {[
                { icon: FiLinkedin, href: '#' },
                { icon: FiTwitter, href: '#' },
                { icon: FiGithub, href: '#' },
                { icon: HiGlobeAlt, href: '#' }
              ].map((social, i) => (
                <a 
                  key={i} 
                  href={social.href}
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-neutral hover:text-primary hover:border-primary hover:bg-primary/5 transition-all"
                >
                  <social.icon className="text-lg" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Cols */}
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h4 className="text-white font-bold mb-6 tracking-wide uppercase text-xs">{section.title}</h4>
              <ul className="space-y-4">
                {section.links.map((link, lIndex) => (
                  <li key={lIndex}>
                    <a 
                      href={link.href} 
                      className="text-neutral text-sm hover:text-primary transition-colors inline-block"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-neutral text-xs font-medium">
            © {currentYear} PMS (ProManage System). All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-neutral text-xs font-medium">
             <span className="flex items-center gap-2">
                Made with <span className="text-danger">♥</span> in India
             </span>
             <div className="h-4 w-px bg-white/10 hidden md:block"></div>
             <a href="#" className="hover:text-white transition-colors">English (US)</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
