import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Quote } from "lucide-react";
import { CLIENT_LOGOS, TESTIMONIALS } from "../data";

export default function Clients() {
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);

  // Auto scroll testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonialIdx((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const handlePrevTestimonial = () => {
    setActiveTestimonialIdx((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const handleNextTestimonial = () => {
    setActiveTestimonialIdx((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  return (
    <>
      <section id="clients" className="py-24 bg-white border-b border-[#c09f53]/10 relative overflow-hidden">
      
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/4 right-0 w-[300px] h-[300px] bg-[#c09f53]/3 rounded-full blur-[90px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <span className="w-1.5 h-1.5 bg-[#c09f53] rounded-full"></span>
            <span className="font-mono text-xs tracking-[0.3em] text-[#c09f53] uppercase font-bold">
              Trusted by Pakistan's Finest
            </span>
            <span className="w-1.5 h-1.5 bg-[#c09f53] rounded-full"></span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-sans text-sm md:text-base text-[#0a2e0a]/80 font-light leading-relaxed"
          >
            A portfolio built on results — leisure destinations and institutions that have placed
            their trust in Horizon Leisure Group.
          </motion.p>
        </div>

      </div> {/* Close the top max-w-7xl container */}

      {/* Infinite Card Slider (Full Width) */}
      <div className="relative w-full overflow-hidden mb-20 select-none py-4" id="client-marquee-container">
        {/* Gradient overlays for smooth fading edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none"></div>

        {/* Marquee Track */}
        <div className="animate-marquee gap-6 flex whitespace-nowrap">
          {/* Double the array for seamless infinite looping */}
          {[...CLIENT_LOGOS, ...CLIENT_LOGOS].map((client, idx) => (
            <div
              key={`${client.id}-${idx}`}
              id={`client-card-slide-${client.id}-${idx}`}
              className="bg-[#FAF9F5] border border-[#c09f53]/10 hover:border-[#c09f53]/45 p-6 rounded-sm text-center flex flex-col justify-center items-center group hover:shadow-lg transition-all duration-300 min-h-[140px] w-[220px] md:w-[260px] flex-shrink-0"
            >
              <span className="font-serif text-3xl font-bold tracking-wider text-[#0a2e0a]/40 group-hover:text-[#c09f53] transition-colors mb-2 block">
                {client.shortName}
              </span>
              <h4 className="font-sans text-[11px] text-[#0a2e0a] font-bold tracking-wide uppercase leading-tight whitespace-normal">
                {client.fullName}
              </h4>
              <p className="font-sans text-[8px] text-[#0a2e0a]/50 tracking-widest mt-1 uppercase font-medium">
                {client.category}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Stats Row */}
        <div className="border-t border-b border-[#c09f53]/15 py-8 mb-24 bg-[#FAF9F5]/40 rounded-sm">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-[#c09f53]/10">
            <div className="text-center pt-4 lg:pt-0">
              <h3 className="font-serif text-3xl text-[#c09f53] font-bold">25+</h3>
              <p className="font-sans text-[10px] tracking-widest uppercase text-[#0a2e0a]/75 mt-1 font-semibold">
                Years of Partnership
              </p>
            </div>
            <div className="text-center pt-4 lg:pt-0">
              <h3 className="font-serif text-3xl text-[#c09f53] font-bold">30+</h3>
              <p className="font-sans text-[10px] tracking-widest uppercase text-[#0a2e0a]/75 mt-1 font-semibold">
                Client Organisations
              </p>
            </div>
            <div className="text-center pt-4 lg:pt-0">
              <h3 className="font-serif text-3xl text-[#c09f53] font-bold">100%</h3>
              <p className="font-sans text-[10px] tracking-widest uppercase text-[#0a2e0a]/75 mt-1 font-semibold">
                Retention Rate
              </p>
            </div>
            <div className="text-center pt-4 lg:pt-0">
              <h3 className="font-serif text-3xl text-[#c09f53] font-bold">PKR 2B+</h3>
              <p className="font-sans text-[10px] tracking-widest uppercase text-[#0a2e0a]/75 mt-1 font-semibold">
                Revenue Managed
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Testimonials Section (Full-Width, elegant solid dark green) */}
    <section id="partners-testimonials" className="py-24 bg-[#0a2e0a] text-white relative overflow-hidden w-full border-t border-b border-[#c09f53]/10">
      {/* Subtle Decorative gold circle */}
      <div className="absolute -top-12 -left-12 w-32 h-32 border border-[#c09f53]/10 rounded-full"></div>
      <div className="absolute -bottom-12 -right-12 w-48 h-48 border border-[#c09f53]/5 rounded-full"></div>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10 text-center">
        {/* Title Matching Team/Directors Pattern */}
        <div className="flex items-center justify-center gap-2.5 mb-6">
          <div className="w-8 h-[1px] bg-[#c09f53]/50"></div>
          <span className="font-mono text-[9px] md:text-[10px] tracking-[0.25em] text-[#c09f53] uppercase font-bold">
            CLIENT VOICES
          </span>
          <div className="w-8 h-[1px] bg-[#c09f53]/50"></div>
        </div>

        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="w-16 h-[1px] bg-[#c09f53] mx-auto mb-6"></div>
          <h3 className="font-serif text-3xl md:text-4xl text-[#f4edd9] leading-tight font-medium">
            What Our Partners Say
          </h3>
        </div>

        <div className="relative min-h-[220px] max-w-3xl mx-auto flex flex-col justify-between items-center" id="testimonial-slider-viewport">
          {/* Quote Icon */}
          <div className="text-[#c09f53]/25 mb-4">
            <Quote size={40} className="fill-current" />
          </div>

          {/* Testimonial Quote Slide */}
          <div className="text-center flex-grow flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonialIdx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <p className="font-serif text-lg md:text-2xl lg:text-3xl text-[#f4edd9] font-light italic leading-relaxed">
                  “{TESTIMONIALS[activeTestimonialIdx].quote}”
                </p>
                
                <div>
                  <h5 className="font-mono text-xs tracking-wider text-[#c09f53] font-bold uppercase">
                    {TESTIMONIALS[activeTestimonialIdx].author}
                  </h5>
                  <p className="font-sans text-[11px] text-[#e5d7af]/55 mt-1">
                    {TESTIMONIALS[activeTestimonialIdx].role}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Carousel Navigation (ONLY pagination dots, no arrows) */}
          <div className="flex items-center justify-center mt-12">
            <div className="flex items-center gap-2.5">
              {TESTIMONIALS.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  id={`dot-testimonial-${dotIdx}`}
                  onClick={() => setActiveTestimonialIdx(dotIdx)}
                  className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
                    activeTestimonialIdx === dotIdx 
                      ? "w-6 bg-[#c09f53]" 
                      : "w-1.5 bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`Go to slide ${dotIdx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  </>
  );
}
