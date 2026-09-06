import { motion } from "motion/react";
import { SERVICE_ITEMS } from "../data";

export default function Services() {
  // Separate items into two rows to match the unique reference grid structure
  const row1Items = SERVICE_ITEMS.filter((item) => !item.darkTheme);
  const row2Items = SERVICE_ITEMS.filter((item) => item.darkTheme);

  return (
    <section id="services" className="py-24 bg-white border-b border-[#c09f53]/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Label: Left-aligned and elegant */}
        <div className="flex items-center gap-2.5 mb-12">
          <div className="w-8 h-[1px] bg-[#c09f53]/50"></div>
          <span className="font-mono text-[10px] md:text-xs tracking-[0.3em] text-[#c09f53] uppercase font-bold">
            WHAT WE DO
          </span>
          <div className="w-8 h-[1px] bg-[#c09f53]/50"></div>
        </div>

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="w-16 h-[1px] bg-[#c09f53] mx-auto mb-6"></div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#0a2e0a] leading-tight mb-4"
          >
            Five Pillars of Club Excellence
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-sans text-sm md:text-base text-[#0a2e0a]/75 font-light leading-relaxed"
          >
            Every service we provide is designed with one purpose — to make your club more
            profitable, more professional, and more admired.
          </motion.p>
        </div>

        {/* Row 1 Grid: Alternating 2x2 with NO GAP between the four cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-[#c09f53]/15 mb-0" id="services-row-1">
          {/* Card 1: */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-64 md:h-auto min-h-[300px] w-full bg-[#112d11] overflow-hidden"
          >
            <div className="absolute inset-0 bg-[#0a2e0a]/20 z-10"></div>
            <img
              src="/sales.jpeg"
              alt={row1Items[0]?.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.parentElement!.style.backgroundImage = "linear-gradient(135deg, #112d11, #0a2e0a)";
              }}
            />
          </motion.div>

          {/* Card 2: Pillar 1 Content */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-[#FAF9F5] p-8 lg:p-12 flex flex-col justify-center border-b md:border-b-0 md:border-l border-[#c09f53]/15"
          >
            <span className="font-mono text-xs text-[#c09f53] font-bold tracking-widest block mb-4 uppercase">
              Pillar {row1Items[0]?.id}
            </span>
            <h3 className="font-serif text-2xl md:text-3xl text-[#0a2e0a] mb-4 hover:text-[#c09f53] transition-colors duration-300">
              {row1Items[0]?.title}
            </h3>
            <p className="font-sans text-sm md:text-base text-[#0a2e0a]/75 font-light leading-relaxed">
              {row1Items[0]?.description}
            </p>
          </motion.div>

          {/* Card 3: Pillar 2 Content (alternating: content first) */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-[#FAF9F5] p-8 lg:p-12 flex flex-col justify-center order-2 md:order-1 border-t md:border-t-0 border-[#c09f53]/15"
          >
            <span className="font-mono text-xs text-[#c09f53] font-bold tracking-widest block mb-4 uppercase">
              Pillar {row1Items[1]?.id}
            </span>
            <h3 className="font-serif text-2xl md:text-3xl text-[#0a2e0a] mb-4 hover:text-[#c09f53] transition-colors duration-300">
              {row1Items[1]?.title}
            </h3>
            <p className="font-sans text-sm md:text-base text-[#0a2e0a]/75 font-light leading-relaxed">
              {row1Items[1]?.description}
            </p>
          </motion.div>

          {/* Card 4: Pillar 2 Image  */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-64 md:h-auto min-h-[300px] w-full bg-[#112d11] overflow-hidden order-1 md:order-2 border-t md:border-t-0 md:border-l border-[#c09f53]/15"
          >
            <div className="absolute inset-0 bg-[#0a2e0a]/20 z-10"></div>
            <img
              src="/marketing.jpeg"
              alt={row1Items[1]?.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.parentElement!.style.backgroundImage = "linear-gradient(135deg, #0a2e0a, #112d11)";
              }}
            />
          </motion.div>
        </div>

        {/* Row 2 Grid: Three columns with rich dark green background and NO GAP */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-l border-r border-b border-[#c09f53]/15" id="services-row-2">
          {row2Items.map((item, idx) => (
            <motion.div
              key={item.id}
              id={`service-card-${item.id}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
              className="group bg-[#0a2e0a] p-8 lg:p-12 flex flex-col justify-between border-b md:border-b-0 border-[#c09f53]/15 last:border-b-0 md:border-r last:border-r-0 relative overflow-hidden"
            >
              {/* Gold Top Light Line hover effect */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#c09f53] to-transparent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>

              <div>
                <span className="font-mono text-xs text-[#c09f53] font-bold tracking-widest block mb-6 uppercase">
                  Pillar {item.id}
                </span>
                <h3 className="font-serif text-xl md:text-2xl text-[#f4edd9] mb-4 group-hover:text-[#c09f53] transition-colors duration-300">
                  {item.title}
                </h3>
              </div>
              
              <p className="font-sans text-xs md:text-sm text-[#f4edd9]/75 font-light leading-relaxed mt-4">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}