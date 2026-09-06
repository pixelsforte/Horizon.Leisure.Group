import { motion } from "motion/react";
import { MessageCircle } from "lucide-react";

//  WhatsApp Number 
const WHATSAPP_NUMBER = "923222165557"; 

// Pre-filled message (optional, can be empty or customized)
const DEFAULT_MESSAGE = "Hello! I am interested in Horizon Leisure Group's premium event and booking services. I would love to connect.";

export default function WhatsAppButton() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 1,
      }}
      className="fixed bottom-5 right-5 z-50"
      id="whatsapp-sticky-wrapper"
    >
      {/* Outer Pulse Glow Effect */}
      <div className="absolute inset-0 rounded-full bg-[#C9A054]/20 animate-ping pointer-events-none" />

      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ 
          scale: 1.08,
          boxShadow: "0 12px 30px rgba(201, 160, 84, 0.4)",
        }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center justify-center w-14 h-14 rounded-full bg-[#C9A054] text-white shadow-[0_4px_14px_rgba(0,0,0,0.15)] transition-all duration-300 relative group border border-[#C9A054]/30"
        id="whatsapp-button"
        aria-label="Contact us on WhatsApp"
      >
        {/* Subtle background gradient on hover */}
        <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#b28b43] to-[#C9A054] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* WhatsApp Icon representation with white color for high contrast */}
        <div className="relative z-10 flex items-center justify-center">
          <MessageCircle size={26} className="text-white fill-current stroke-[2]" />
          {/* Subtle chat notification-style dot inside for realistic luxury messaging vibe */}
          <span className="absolute w-1.5 h-1.5 rounded-full bg-white top-2 right-1.5 animate-pulse" />
        </div>

        {/* Premium Tooltip */}
        <div className="absolute right-16 bg-[#041910] text-[#f4edd9] border border-[#c09f53]/30 px-3 py-1.5 rounded-sm text-xs font-mono tracking-wider uppercase opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-xl">
          CONNECT ON WHATSAPP
        </div>
      </motion.a>
    </motion.div>
  );
}
