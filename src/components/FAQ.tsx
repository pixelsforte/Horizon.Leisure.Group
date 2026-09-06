import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, X } from "lucide-react";
import { FAQ_ITEMS } from "../data";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleIndex = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section id="faq" className="py-24 bg-[#FAF9F5] border-b border-[#c09f53]/10">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <span className="w-1.5 h-1.5 bg-[#c09f53] rounded-full"></span>
            <span className="font-mono text-xs tracking-[0.3em] text-[#c09f53] uppercase font-bold">
              Frequently Asked
            </span>
            <span className="w-1.5 h-1.5 bg-[#c09f53] rounded-full"></span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#0a2e0a] leading-tight"
          >
            Questions We Hear Often
          </motion.h2>
        </div>

        {/* Accordion List */}
        <div className="space-y-4" id="faq-accordion-list">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                key={idx}
                id={`faq-item-${idx}`}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="bg-white border border-[#c09f53]/10 rounded-sm overflow-hidden shadow-xs hover:border-[#c09f53]/35 transition-colors"
              >
                {/* Accordion Trigger Button */}
                <button
                  type="button"
                  id={`faq-trigger-${idx}`}
                  onClick={() => toggleIndex(idx)}
                  className="w-full text-left p-6 md:p-8 flex justify-between items-center gap-6 focus:outline-none cursor-pointer group"
                >
                  <span className="font-serif text-base md:text-lg lg:text-xl text-[#0a2e0a] font-medium leading-snug group-hover:text-[#c09f53] transition-colors">
                    {item.question}
                  </span>
                  
                  {/* Icon Toggle Wrapper */}
                  <span
                    className={`flex-shrink-0 w-8 h-8 rounded-full border border-[#c09f53]/20 flex items-center justify-center text-[#c09f53] transition-all duration-300 ${
                      isOpen ? "bg-[#c09f53] text-[#0D3B0D] border-[#c09f53] rotate-45" : "group-hover:border-[#c09f53]/50"
                    }`}
                  >
                    {isOpen ? <X size={14} className="stroke-[2.5]" /> : <Plus size={14} className="stroke-[2.5]" />}
                  </span>
                </button>

                {/* Accordion Content Panel */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-content-${idx}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ 
                        height: "auto", 
                        opacity: 1,
                        transition: { height: { duration: 0.35, ease: "easeOut" }, opacity: { duration: 0.25, delay: 0.1 } }
                      }}
                      exit={{ 
                        height: 0, 
                        opacity: 0,
                        transition: { height: { duration: 0.3, ease: "easeIn" }, opacity: { duration: 0.2 } }
                      }}
                    >
                      <div className="px-6 md:px-8 pb-6 md:pb-8 text-xs md:text-sm text-[#0a2e0a]/75 font-light leading-relaxed border-t border-[#c09f53]/5 pt-4">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
