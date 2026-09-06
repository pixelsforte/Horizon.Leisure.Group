import { motion } from "motion/react";
import { DIFFERENCE_PILLARS } from "../data";

export default function Difference() {
  return (
    <section id="difference" className="py-24 bg-[#FAF9F5] border-b border-[#c09f53]/10 relative overflow-hidden">
      
      {/* Background overlay accent */}
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,rgba(192,159,83,0.03),transparent_60%)] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Section Header - Centered exactly like the image */}
        <div className="max-w-3xl mx-auto mb-16 text-center flex flex-col items-center">
          <div className="w-16 h-[1px] bg-[#c09f53] mb-6"></div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#0a2e0a] leading-tight mb-4"
          >
            The Horizon Difference
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-sans text-sm md:text-base text-[#0a2e0a]/75 font-light leading-relaxed max-w-xl"
          >
            Four pillars that set us apart from every other management company in Pakistan.
          </motion.p>
        </div>

        {/* Pillars Grid - Restricted to max 2 columns for the 2x2 layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-l border-[#c09f53]/15 max-w-6xl mx-auto" id="difference-pillars-grid">
          {DIFFERENCE_PILLARS.map((pillar, idx) => (
            <motion.div
              key={pillar.number}
              id={`difference-pillar-card-${idx}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
             
              className="bg-white border-r border-b border-[#c09f53]/15 p-12 md:p-16 flex flex-col justify-between min-h-[320px] transition-colors duration-300 group hover:bg-[#FAF9F5]/50 relative overflow-hidden"
            >
              <div>
                {/* Pillar Number */}
                <span className="font-mono text-xs text-[#c09f53] font-bold tracking-widest uppercase block mb-6">
                  {pillar.number}
                </span>

                {/* Pillar Title */}
                <h3 className="font-serif text-2xl md:text-3xl text-[#0a2e0a] mb-6 group-hover:text-[#c09f53] transition-colors leading-snug duration-300">
                  {pillar.title}
                </h3>
              </div>

              {/* Pillar Description */}
              <p className="font-sans text-sm md:text-base text-[#0a2e0a]/70 font-light leading-relaxed mt-4 max-w-md">
                {pillar.description}
              </p>

              {/* Optional: Large watermark number in background like the image */}
              <div className="absolute bottom-4 right-8 font-serif text-[7rem] md:text-[9rem] text-[#c09f53]/5 pointer-events-none select-none font-bold tracking-tighter leading-none">
                {pillar.number.split('/')[0]}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}