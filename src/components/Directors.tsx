import { motion } from "motion/react";

const LOCAL_DIRECTORS = [
  {
    name: "Muhammad Amin ud Din",
    title: "C.E.O",
    image: "/director1.jpg",
    initials: "M.A.",
    experience: [
      { role: "CEO", company: "Ultimate Marketing Solutions (pvt) Ltd", years: "Since 2021" },
      { role: "CEO", company: "Pakistan Tracker & Services", years: "Since 2018" },
      { role: "CEO", company: "TURK STATION", years: "" },
      { role: "GENERAL MANAGER", company: "Joyland & AA Joyland", years: "Since 2013" }
    ]
  },
  {
    name: "Col. Amir Shakeel",
    title: "Group Director",
    image: "/director2.jpg",
    initials: "C.A.",
    experience: [
      { role: "Served", company: "in ARMY", years: "1983 to 2013" },
      { role: "DIRECTOR", company: "admin & security City school system", years: "2012/13" },
      { role: "DIRECTOR", company: "DHA services, Golf club, creek club", years: "2023/17" },
      { role: "MEMBER", company: "AA JOYLAND", years: "2017 -2021" },
      { role: "MEMBER", company: "RAMADA HOTEL", years: "2023-24" }
    ]
  }
];

export default function Directors() {
  return (
    <section id="directors" className="py-24 bg-[#0a2e0a] border-b border-[#c09f53]/10 text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto mb-20 text-center flex flex-col items-center">
          <div className="w-16 h-[1px] bg-[#c09f53] mb-6"></div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-3xl md:text-4xl lg:text-5xl text-white leading-tight mb-4"
          >
            The Minds Behind Horizon
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-sans text-sm md:text-base text-white/75 font-light leading-relaxed max-w-xl"
          >
            Decades of combined expertise. A singular focus on your club's success.
          </motion.p>
        </div>

        {/* Profiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start" id="directors-profiles-grid">
          {LOCAL_DIRECTORS.map((director, idx) => (
            <motion.div
              key={director.name}
              id={`director-card-${idx}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.2 }}
              className="flex flex-col bg-[#0b3320]/40 border border-[#c09f53]/10 overflow-hidden group"
            >
              
              {/* Image Container with explicit constraints */}
              <div className="relative aspect-[4/3] bg-gradient-to-br from-[#112d11] to-[#0a2e0a] overflow-hidden flex items-center justify-center">
                
                {/* Fallback initials display if images fail to render */}
                <div className="absolute inset-0 flex items-center justify-center font-serif text-4xl text-[#c09f53]/20 tracking-wider uppercase pointer-events-none select-none">
                  {director.initials}
                </div>

                <img
                  src={director.image}
                  alt={director.name}
                  className="w-full h-full object-cover object-center grayscale-[15%] group-hover:scale-105 transition-transform duration-700 ease-out z-10 raw-img"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Agar path issue ho to fallback trigger karega overlay hide karke
                    e.currentTarget.style.opacity = "0";
                  }}
                />
              </div>

              {/* Card Content */}
              <div className="p-8 md:p-10 flex flex-col flex-grow">
                {/* Title/Role */}
                <span className="font-mono text-[10px] md:text-xs text-[#c09f53] tracking-[0.2em] uppercase font-bold block mb-2">
                  {director.title}
                </span>
                
                {/* Name */}
                <h3 className="font-serif text-2xl md:text-3xl text-white tracking-wide mb-6">
                  {director.name}
                </h3>

                <div className="w-12 h-[1px] bg-[#c09f53]/40 mb-8"></div>
                
                {/* Selected Track Record List */}
                <div className="space-y-6" id={`director-exp-${idx}`}>
                  {director.experience.map((exp, eIdx) => (
                    <div
                      key={eIdx}
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-white/5 pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                        {/* Left Side: Role Badge */}
                        <span className="font-mono text-[10px] text-[#c09f53] font-bold uppercase tracking-wider min-w-[90px]">
                          {exp.role}
                        </span>
                        {/* Middle: Company Name */}
                        <span className="font-sans text-sm md:text-base text-white/90 font-light">
                          {exp.company}
                        </span>
                      </div>
                      {/* Right Side: Years */}
                      <span className="font-sans text-xs md:text-sm text-white/40 sm:text-right shrink-0">
                        {exp.years}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}