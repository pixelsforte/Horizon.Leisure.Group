import { motion } from "motion/react";
import { Sparkles, ArrowRight } from "lucide-react";
import { PARTNERSHIP_MODELS } from "../data";

interface PartnershipProps {
  onSelectModel: (modelName: string) => void;
}

export default function Partnership({ onSelectModel }: PartnershipProps) {
  
  const handleSelect = (modelTitle: string) => {
    onSelectModel(modelTitle);
    
    // Smooth scroll to the contact form
    const element = document.getElementById("contact");
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
      id="partnership"
      className="py-24 bg-[#0D3B0D] text-white relative overflow-hidden border-b border-[#c09f53]/10"
    >
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[350px] h-[350px] bg-[#c09f53]/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#0a2e0a]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="flex items-center justify-center gap-2.5 mb-6">
            <div className="w-8 h-[1px] bg-[#c09f53]/50"></div>
            <span className="font-mono text-[10px] md:text-xs tracking-[0.3em] text-[#c09f53] uppercase font-bold">
              PARTNERSHIP
            </span>
            <div className="w-8 h-[1px] bg-[#c09f53]/50"></div>
          </div>

          <div className="w-16 h-[1px] bg-[#c09f53]/60 mx-auto mb-6"></div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-3xl md:text-4xl lg:text-5xl leading-tight mb-4"
          >
            <span className="text-white">Choose Your Path</span>
            <br />
            <span className="text-[#c09f53] italic"> Your Success</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-sans text-sm md:text-base text-[#e5d7af]/80 font-light leading-relaxed"
          >
            Three distinct partnership models. One unwavering commitment — your club's
            transformation.
          </motion.p>
        </div>

        {/* Partnership Models Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-16" id="partnership-models-grid">
          {PARTNERSHIP_MODELS.map((model, idx) => {
            const isPopular = !!model.badge;
            return (
              <motion.div
                key={model.id}
                id={`partnership-card-${model.id}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.15 }}
                className={`relative flex flex-col justify-between p-8 lg:p-10 rounded-sm border transition-all duration-500 bg-[#0a2e0a]/65 backdrop-blur-md hover:shadow-2xl ${
                  isPopular
                    ? "border-[#c09f53] shadow-[0_15px_40px_rgba(192,159,83,0.12)] scale-102 lg:-translate-y-2 z-10"
                    : "border-[#c09f53]/20 hover:border-[#c09f53]/45"
                }`}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#c09f53] text-[#0D3B0D] text-[10px] tracking-[0.2em] font-sans font-bold py-1 px-4 flex items-center gap-1.5 uppercase rounded-full shadow-lg border border-[#f4edd9]/50">
                    <Sparkles size={11} className="animate-spin-slow" />
                    {model.badge}
                    <Sparkles size={11} className="animate-spin-slow" />
                  </div>
                )}

                {/* Card Title & Values */}
                <div>
                  <span className="font-mono text-[10px] text-[#c09f53] font-bold tracking-widest uppercase block mb-2">
                    {model.modelNumber}
                  </span>
                  <h3 className="font-serif text-2xl md:text-3xl text-[#f4edd9] mb-6">
                    {model.title}
                  </h3>

                  <div className="mb-2">
                    <span className="font-serif text-4xl lg:text-5xl text-[#c09f53] font-light tracking-tight">
                      {model.percentage}
                    </span>
                  </div>
                  <span className="font-sans text-[11px] tracking-widest text-[#e5d7af]/70 uppercase block mb-8 font-medium">
                    {model.subtitle}
                  </span>

                  {/* Bullet Lists */}
                  <div className="h-[1px] bg-[#c09f53]/15 w-full mb-8"></div>
                  <ul className="space-y-4 mb-8">
                    {model.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex gap-3 text-xs md:text-sm text-[#f4edd9]/85 leading-relaxed font-light">
                        <span className="text-[#c09f53] mt-0.5">•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Select Button */}
                <button
                  id={`cta-select-model-${model.id}`}
                  onClick={() => handleSelect(model.title)}
                  className={`w-full py-3.5 flex items-center justify-center gap-2 font-sans text-xs tracking-widest uppercase border transition-all duration-300 font-semibold rounded-sm cursor-pointer ${
                    isPopular
                      ? "bg-[#c09f53] text-[#0D3B0D] border-[#c09f53] hover:bg-transparent hover:text-[#c09f53]"
                      : "border-[#c09f53]/50 text-[#e5d7af] hover:bg-[#c09f53] hover:text-[#0D3B0D]"
                  }`}
                >
                  Select this Model <ArrowRight size={13} />
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Consultation Block - flowing naturally without boxed borders */}
        <motion.div
          id="partnership-consultation"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="pt-16 pb-8 text-center max-w-4xl mx-auto"
        >
          <p className="font-sans text-sm md:text-base text-[#e5d7af]/90 max-w-2xl mx-auto mb-8 leading-relaxed font-light">
            Not sure which model suits your situation? Our team will walk you through each
            option in a complimentary 30-minute consultation.
          </p>

          <button
            id="cta-book-free-consultation"
            onClick={() => handleSelect("complimentary-consultation")}
            className="px-8 py-4 bg-[#c09f53] text-[#0D3B0D] font-sans text-xs tracking-widest uppercase hover:bg-[#aa863e] transition-colors font-bold rounded-sm inline-flex items-center gap-2 cursor-pointer shadow-lg"
          >
            Book your Free Consultation
          </button>
        </motion.div>

      </div>
    </section>
  );
}
