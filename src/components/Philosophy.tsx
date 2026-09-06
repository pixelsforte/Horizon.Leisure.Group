import { motion } from "motion/react";

export default function Philosophy() {
  return (
    <section className="bg-gold-50 py-24 md:py-32 border-b border-gold-200/40 relative">
        <div className="absolute inset-0 opacity-[0.01] bg-[radial-gradient(#AF8F2C_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] pointer-events-none" />
        <div className="mx-auto max-w-4xl px-6 text-center relative z-10">
          
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-[1.5px] w-6 bg-gold-500/30" />
            <span className="font-sans text-[0.7rem] tracking-[0.35em] text-gold-600 font-bold uppercase">
              OUR PHILOSOPHY
            </span>
            <div className="h-[1.5px] w-6 bg-gold-500/30" />
          </div>

          <p className="font-serif text-2xl sm:text-4xl md:text-5xl font-light text-green-950 tracking-wide leading-[1.3] text-center max-w-3xl mx-auto italic">
            “We don't just manage clubs. <br />
            We transform them into <br />
            <span className="text-gold-500 font-medium not-italic">thriving, profitable legacies</span>.”
          </p>

          <div className="mt-10 flex items-center justify-center gap-4">
            <div className="h-[1px] w-8 bg-gold-300" />
            <span className="font-sans text-xs tracking-[0.2em] text-green-950/60 uppercase">
              Horizon Leisure Group · Est. 1999
            </span>
            <div className="h-[1px] w-8 bg-gold-300" />
          </div>

          {/* Three gold dots */}
           <div className="flex items-center gap-6 my-12 opacity-100 transform-none">
      {/* Left Gradient Line */}
      <div className="flex-1 h-[1px] relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
      </div>

      {/* Center Diamond Accents */}
      <div className="flex items-center gap-2 select-none">
        <span className="text-[10px] text-gold-500">◆</span>
        <span className="text-[6px] text-gold-500/50">◆</span>
        <span className="text-[10px] text-gold-500">◆</span>
      </div>

      {/* Right Gradient Line */}
      <div className="flex-1 h-[1px] relative">
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-gold-500/50 to-transparent" />
      </div>
    </div>
        </div>
      </section>
  );
}
