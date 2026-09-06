import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ArrowRight } from "lucide-react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const navItems = [
    { label: "ABOUT", id: "about" },
    { label: "SERVICES", id: "services" },
    { label: "PARTNERSHIP", id: "partnership" },
    { label: "DIRECTORS", id: "directors" },
    { label: "TEAM", id: "team" },
    { label: "EVENTS", id: "events" },
    { label: "CONTACT", id: "contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sections = ["home", "about", "services", "partnership", "directors", "team", "events", "contact"];
    const observers = sections.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { threshold: 0.3, rootMargin: "-80px 0px -20% 0px" }
      );
      observer.observe(el);
      return { observer, el };
    });

    return () => {
      observers.forEach((obs) => {
        if (obs) {
          obs.observer.unobserve(obs.el);
        }
      });
    };
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <>
      <motion.header
        id="main-header"
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 ${
          isScrolled 
            ? "bg-[#0D3B0D]/95 backdrop-blur-md border-b border-[#c09f53]/20 shadow-xl py-4" 
            : "bg-transparent py-6"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex justify-between items-center">
          
          {/* Logo / Brand Name Section */}
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => scrollToSection("home")}
            id="brand-logo"
          >
            {/* Direct reference to public folder path (No bundle resolution needed) */}
            <img 
              src="/logo.png" 
              alt="Horizon Logo" 
              className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            
            <div>
              <h1 className="font-serif text-[#f4edd9] tracking-[0.2em] text-lg uppercase leading-none">
                Horizon
              </h1>
              <p className="font-sans text-[9px] tracking-[0.25em] text-[#c09f53] uppercase mt-1">
                Leisure Group
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8" id="desktop-nav">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => scrollToSection(item.id)}
                className={`font-sans text-xs tracking-widest font-medium cursor-pointer transition-all duration-300 relative py-1 hover:text-[#e5d7af] ${
                  activeSection === item.id 
                    ? "text-[#c09f53]" 
                    : "text-[#f4edd9]/75"
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <motion.span 
                    layoutId="activeIndicator"
                    className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#c09f53]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Right Action Button */}
          <div className="hidden lg:block">
            <button
              id="cta-request-meeting-header"
              onClick={() => scrollToSection("contact")}
              className="px-5 py-2.5 border border-[#c09f53]/60 bg-[#0D3B0D]/40 text-[#e5d7af] font-sans text-xs tracking-widest uppercase hover:bg-[#c09f53] hover:text-[#0D3B0D] transition-all duration-300 font-medium cursor-pointer rounded-sm"
            >
              Request a Meeting
            </button>
          </div>

          {/* Hamburger Menu Mobile Button */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-[#f4edd9] hover:text-[#c09f53] transition-colors p-1"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-navigation-drawer"
            className="fixed inset-0 z-30 bg-[#0D3B0D] flex flex-col justify-between pt-24 pb-12 px-8 lg:hidden"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", bounce: 0.1, duration: 0.5 }}
          >
            <div className="flex flex-col gap-6 mt-8">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  id={`mobile-nav-link-${item.id}`}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-left font-serif text-3xl tracking-wide uppercase transition-colors py-2 ${
                    activeSection === item.id ? "text-[#c09f53]" : "text-[#f4edd9]/80"
                  }`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {item.label.toLowerCase()}
                </motion.button>
              ))}
            </div>

            <motion.div 
              className="flex flex-col gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="h-[1px] bg-[#c09f53]/20 w-full mb-4"></div>
              <button
                id="cta-request-meeting-mobile"
                onClick={() => scrollToSection("contact")}
                className="w-full py-4 bg-[#c09f53] text-[#0D3B0D] font-sans text-xs tracking-widest uppercase hover:bg-[#aa863e] transition-colors font-semibold flex items-center justify-center gap-2 rounded-sm"
              >
                Request a Meeting <ArrowRight size={14} />
              </button>
              <p className="text-center text-[10px] text-[#e5d7af]/45 tracking-widest uppercase mt-4">
                Est. 1999 • Karachi, Pakistan
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}