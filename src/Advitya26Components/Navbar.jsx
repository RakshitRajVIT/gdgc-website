import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, Gamepad2, Users, Store, Info } from 'lucide-react';
import './Navbar.css';

const navLinks = [
  { href: '/', label: 'Home', icon: Home, underlineColor: '#3b82f6' },
  { href: '/games', label: 'Games', icon: Gamepad2, underlineColor: '#000000' },
  { href: '/community', label: 'Community', icon: Users, underlineColor: '#eab308' },
  { href: '/store', label: 'Store', icon: Store, underlineColor: '#22c55e' },
  { href: '/about', label: 'About', icon: Info, underlineColor: '#ef4444' },
];

export function GlobalNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRotatingLogo, setIsRotatingLogo] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = '/Olympics-Logo.png';
    if (img.decode) img.decode().catch(() => {});
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 p-4 lg:p-6 lg:h-20 font-montserrat flex justify-end"
    >
      <div
        className="flex flex-row-reverse items-center gap-4"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        {/* Logo */}
        <motion.div
          className="w-17 h-17 md:w-20 md:h-20 lg:w-24 lg:h-24 cursor-pointer flex items-center justify-center"
          whileHover={{ scale: 1.25, rotate: 360 }}
          transition={{ duration: 0.3, ease: 'linear',}}
          style={{
            filter: 'drop-shadow(0 0 10px rgba(232, 239, 211, 0.6)) drop-shadow(0 0 20px rgba(34, 197, 94, 0.4))',
            transformOrigin: 'center',
            willChange: 'transform',
            backfaceVisibility: 'hidden',
          }}
        >
          <img
            src="/Olympics-Logo.png"
            alt="Logo"
            className="w-full h-full object-contain"
          />
        </motion.div>

        {/* Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.nav
              role="navigation"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-none lg:rounded-full absolute left-0 right-0 top-full z-50 lg:static lg:rounded-full overflow-hidden"
              style={{
                border: '2px ',
                background: '#f7f6e4',
                backgroundColor: '#faf8e0',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
                boxShadow: '0 0 15px rgba(21, 21, 21, 0.6), 0 0 30px rgba(32, 18, 18, 0.4), 0 0 45px rgb(23, 19, 21)',
              }}
            >
              <ul className="flex flex-col lg:flex-row items-start lg:items-center gap-0 lg:gap-2 px-0 lg:px-4 py-2">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <motion.li key={link.href} whileHover={{ y: -2 }} className="w-full lg:w-auto">
                      <Link
                        to={link.href}
                        className="relative flex items-center gap-2 px-3 py-2 rounded-full hover:bg-black/10 transition-colors text-black text-sm group"
                      >
                        <Icon size={16} />
                        <span>{link.label}</span>
                        <span
                          className="absolute bottom-1 left-3 right-3 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-right"
                          style={{ backgroundColor: link.underlineColor }}
                        />
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>

 
      </div>
    </motion.header>
  );
}

export default GlobalNavbar;
