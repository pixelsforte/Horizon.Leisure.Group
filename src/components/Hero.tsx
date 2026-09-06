import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";

export default function Hero() {
  const scrollToId = (id: string) => {
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
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-between bg-[#0d3b0d] text-white pt-28 overflow-hidden"
      style={{
        backgroundImage: "linear-gradient(to bottom, rgba(13, 59, 13, 0.87), rgba(20, 124, 20, 0.65)), url('/banner1.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#c09f53]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex-grow flex flex-col justify-center items-center text-center relative z-10 py-12">
        <motion.div
          id="hero-badge"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6 flex items-center gap-3"
        >
          <span className="w-1.5 h-1.5 bg-[#c09f53] rounded-full"></span>
          <span className="font-mono text-xs tracking-[0.4em] text-[#e5d7af] uppercase">
            EST. 1999 • KARACHI, PAKISTAN 
          </span>
          <span className="w-1.5 h-1.5 bg-[#c09f53] rounded-full"></span>
        </motion.div>

        <motion.h1
          id="hero-title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-5xl md:text-7xl lg:text-8xl text-[#f4edd9] leading-[1.1] mb-6 max-w-4xl tracking-tight [text-shadow:0_4px_24px_rgba(0,0,0,0.5)]"
        >
          Where Leisure <br />
          <span className="italic text-[#c09f53]">Meets Excellence</span>
        </motion.h1>

        <motion.p
          id="hero-tagline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="font-sans text-base md:text-lg lg:text-xl text-[#f4edd9]/90 max-w-2xl mb-12 tracking-wide font-light [text-shadow:0_2px_12px_rgba(0,0,0,0.4)]"
        >
          Pakistan's most trusted leisure management partner
        </motion.p>

        <motion.div
          id="hero-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center w-full sm:w-auto"
        >
          <button
            id="cta-explore-partnership"
            onClick={() => scrollToId("partnership")}
            className="w-full sm:w-auto px-8 py-4 bg-[#c09f53] text-[#0d3b0d] font-sans text-xs tracking-widest uppercase hover:bg-[#aa863e] transition-all duration-300 font-bold rounded-sm shadow-lg cursor-pointer"
          >
            Explore Partnership
          </button>
          <button
            id="cta-our-story"
            onClick={() => scrollToId("about")}
            className="w-full sm:w-auto px-8 py-4 border border-[#f4edd9]/35 hover:border-[#c09f53] text-[#f4edd9] hover:text-[#c09f53] font-sans text-xs tracking-widest uppercase transition-all duration-300 font-semibold rounded-sm bg-[#0d3b0d]/40 backdrop-blur-md cursor-pointer"
          >
            Our Story
          </button>
        </motion.div>
      </div>

      <div className="relative z-10 w-full mt-auto">
        <div className="border-t border-b border-[#f4edd9]/10 bg-[#0d3b0d]/80 backdrop-blur-md py-6">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-[#f4edd9]/10">
            <motion.div
              className="text-center pt-4 lg:pt-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <h3 className="font-serif text-3xl lg:text-4xl text-[#c09f53] font-semibold">25+</h3>
              <p className="font-sans text-[10px] tracking-widest uppercase text-[#e5d7af]/70 mt-1">
                Years Experience
              </p>
            </motion.div>
            <motion.div
              className="text-center pt-4 lg:pt-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <h3 className="font-serif text-3xl lg:text-4xl text-[#c09f53] font-semibold">3</h3>
              <p className="font-sans text-[10px] tracking-widest uppercase text-[#e5d7af]/70 mt-1">
                Partnership Models
              </p>
            </motion.div>
            <motion.div
              className="text-center pt-4 lg:pt-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              <h3 className="font-serif text-3xl lg:text-4xl text-[#c09f53] font-semibold">100%</h3>
              <p className="font-sans text-[10px] tracking-widest uppercase text-[#e5d7af]/70 mt-1">
                Transparent Reporting
              </p>
            </motion.div>
            <motion.div
              className="text-center pt-4 lg:pt-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.6 }}
            >
              <h3 className="font-serif text-3xl lg:text-4xl text-[#c09f53] font-semibold">Multi-city</h3>
              <p className="font-sans text-[10px] tracking-widest uppercase text-[#e5d7af]/70 mt-1">
                Pakistan Presence
              </p>
            </motion.div>
          </div>
        </div>

        <div className="flex flex-col items-center py-4 bg-[#0d3b0d]">
          <button
            id="scroll-indicator-button"
            onClick={() => scrollToId("about")}
            className="flex flex-col items-center gap-1 group text-[#e5d7af]/60 hover:text-[#c09f53] transition-colors cursor-pointer"
          >
            <span className="font-mono text-[9px] tracking-[0.3em] uppercase">SCROLL</span>
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              <ChevronDown size={14} />
            </motion.div>
          </button>
        </div>
      </div>
    </section>
  );
}