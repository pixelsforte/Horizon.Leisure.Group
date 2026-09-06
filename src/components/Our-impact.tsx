import { useState, useEffect, useRef } from "react";

const IMPACT_STATS = [
  { target: 500, suffix: "+", label: "Members Added Across Clients" },
  { target: 40, suffix: "%", label: "Average Revenue Increase" },
  { target: 3, suffix: "", label: "Flexible Partnership Models" },
  { target: 25, suffix: "+", label: "Years of Industry Expertise" },
];

function LiveCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(1); 
  const [hasStarted, setHasStarted] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 } 
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;

    let startTimestamp: number | null = null;
    const duration = 2000; 

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
  
      const currentCount = Math.floor(progress * (target - 1) + 1);
      
      setCount(currentCount);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [hasStarted, target]);

  return (
    <div ref={elementRef} className="font-serif text-4xl sm:text-5xl text-gold-500 font-bold tracking-tight">
      {count}
      {suffix}
    </div>
  );
}

export default function ImpactSection() {
  return (
    <section className="bg-gold-50 py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.01] bg-[radial-gradient(#AF8F2C_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] pointer-events-none" />
      <div className="mx-auto max-w-7xl px-6 md:px-12 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-[1.5px] w-6 bg-gold-500" />
            <span className="font-sans text-[0.7rem] tracking-[0.3em] text-gold-600 font-bold uppercase">
              OUR IMPACT
            </span>
            <div className="h-[1.5px] w-6 bg-gold-500" />
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-green-950 tracking-wide leading-tight">
            Numbers That Speak for <span className="text-gold-500 font-normal italic pr-2">Themselves</span>
          </h2>

          <p className="mt-6 font-sans text-sm sm:text-base text-green-900/60 tracking-widest leading-relaxed font-light">
            Proven results across Pakistan's most prestigious leisure facilities.
          </p>
        </div>

        {/* Impact Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {IMPACT_STATS.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white border border-gold-200/40 p-8 flex flex-col justify-center items-center text-center relative shadow-sm group hover:border-gold-400 transition-colors duration-300"
            >
              {/* Live Counter */}
              <LiveCounter target={stat.target} suffix={stat.suffix} />
              
              <span className="mt-3 font-sans text-[0.6rem] sm:text-[0.65rem] tracking-[0.15em] text-green-950 font-semibold uppercase">
                {stat.label}
              </span>

              {/* Corner design accents */}
              <div className="absolute top-2 right-2 border-t border-r border-gold-300/10 w-2 h-2 pointer-events-none group-hover:border-gold-400/25 transition-colors" />
              <div className="absolute bottom-2 left-2 border-b border-l border-gold-300/10 w-2 h-2 pointer-events-none group-hover:border-gold-400/25 transition-colors" />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}