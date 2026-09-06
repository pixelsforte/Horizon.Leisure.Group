import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface LoaderProps {
  onComplete: () => void;
  key?: string;
}

export default function Loader({ onComplete }: LoaderProps) {
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDone(true);
      const exitTimer = setTimeout(onComplete, 800); // Allow slide up animation to finish
      return () => clearTimeout(exitTimer);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: isDone ? "-100%" : 0 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
  
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0D3B0D] text-[#f4edd9]"
    >
      <div className="relative flex flex-col items-center">
        
        {/* Logo Container - Replaced Circle Animations */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: [0.9, 1.02, 1], opacity: 1 }}
          transition={{ 
            duration: 1.2, 
            ease: "easeOut"
          }}
          className="relative mb-6 flex h-24 items-center justify-center"
        >
          {/* Subtle slow pulsing ambient light effect behind logo */}
          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute h-20 w-20 rounded-full bg-[#c09f53] blur-xl"
          />
          
          {/* Your Core logo.png Image Component */}
          <img 
            src="/logo.png" 
            alt="Horizon Logo" 
            className="h-20 w-auto object-contain relative z-10"
          />
        </motion.div>

        {/* Title reveal */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="font-serif text-3xl tracking-[0.25em] text-[#f4edd9] md:text-4xl uppercase"
        >
          HORIZON
        </motion.h1>

        {/* Tagline reveal */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-2 font-sans text-xs tracking-[0.4em] text-[#c09f53] uppercase"
        >
          Leisure Group
        </motion.p>

        {/* Premium Gold Dynamic loading line */}
        <div className="mt-12 h-[1px] w-48 overflow-hidden bg-[#c09f53]/10">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="h-full w-2/3 bg-gradient-to-r from-transparent via-[#c09f53] to-transparent"
          />
        </div>
      </div>
    </motion.div>
  );
}