import { motion } from "motion/react";
import { Check } from "lucide-react";

export default function About() {
  const highlights = [
    "Club Sales & Revenue Management",
    "Indoor Recreational Facility Expertise",
    "Membership Growth & Loyalty Programs",
  ];

  return (
    <section id="about" className="bg-gold-50 py-24 md:py-32 relative overflow-hidden">
      {/* Abstract background grid */}
      <div className="absolute inset-0 opacity-[0.01] bg-[linear-gradient(to_right,#AF8F2C_1px,transparent_1px),linear-gradient(to_bottom,#AF8F2C_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column - Image Frame */}
          <div className="lg:col-span-5 flex justify-center order-last lg:order-first">
            <div className="relative w-full max-w-md aspect-[4/5] bg-green-900 double-border overflow-hidden shadow-2xl">
              {/* Fallback pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-950 to-green-900 flex flex-col justify-between p-8 text-gold-50 z-0">
                <div className="border-t border-l border-gold-400/30 w-12 h-12" />
                <div className="flex flex-col gap-2">
                  <span className="font-serif text-2xl text-gold-300">SHAPING</span>
                  <span className="text-xs tracking-[0.2em] uppercase text-white/50">LEISURE INDUSTRY</span>
                </div>
                <div className="self-end border-b border-r border-gold-400/30 w-12 h-12" />
              </div>

              <img
                src="/about.jpeg"
                alt="25 Years of Shaping Pakistan's Leisure Industry"
                className="absolute inset-0 w-full h-full object-cover z-10  brightness-95"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-green-950/40 via-transparent to-transparent z-20" />
              <div className="absolute inset-4 border border-gold-400/20 z-20 pointer-events-none" />
            </div>
          </div>

          {/* Right Column - Text Details */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[1.5px] w-6 bg-gold-500" />
              <span className="font-sans text-[0.7rem] tracking-[0.3em] text-gold-600 font-bold uppercase">
                ABOUT HORIZON
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-green-950 tracking-wide leading-tight">
              25 Years of Shaping Pakistan's <br />
              <span className="text-gold-500 font-normal italic pr-2">Leisure Industry</span>
            </h2>

            <div className="mt-8 space-y-6 font-sans text-sm sm:text-base text-green-900/80 tracking-wide leading-relaxed font-light">
              <p>
                Horizon Leisure Group was founded on a simple belief: that every leisure facility
                in Pakistan deserves professional management, strategic sales leadership, and the
                kind of operational excellence that transforms potential into profit.
              </p>
              <p>
                With over 25 years of combined expertise across sales, marketing, customer service,
                and operations — our team has worked with indoor clubs, fitness gyms, private
                recreation facilities, and hospitality venues across Pakistan.
              </p>
              <p>
                We are not consultants who advise from the sidelines. We step in, take
                ownership, and deliver measurable results — with full transparency at every
                step.
              </p>
            </div>

            {/* Premium Gold bullet points list */}
            <div className="mt-10 border-t border-gold-200/40 pt-8">
              <ul className="space-y-4">
                {highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-center gap-4 text-green-950 font-medium">
                    <span className="text-gold-500 text-xs">♦</span>
                    <span className="font-sans text-xs sm:text-sm tracking-wider uppercase">
                      {highlight}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
