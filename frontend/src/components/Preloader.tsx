"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const words = ["STRENGTH", "GRIT", "DISCIPLINE", "POWER", "IRON CORE"];

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const [index, setIndex] = useState(0);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    // Stagger word index changes
    if (index < words.length - 1) {
      const timeout = setTimeout(() => {
        setIndex((prev) => prev + 1);
      }, 350);
      return () => clearTimeout(timeout);
    }
  }, [index]);

  useEffect(() => {
    // Linear scale up of percentage
    const interval = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 400);
          return 100;
        }
        return prev + 1;
      });
    }, 15);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-surface-container-lowest text-white"
      initial={{ opacity: 1 }}
      exit={{ 
        y: "-100vh",
        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
      }}
    >
      <div className="relative flex flex-col items-center gap-6 select-none">
        {/* Animated word block */}
        <div className="h-16 overflow-hidden flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={index}
              className="font-display-xl text-3xl md:text-5xl italic tracking-tighter text-primary-fixed uppercase font-black"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -40, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {words[index]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Barbell graphic that fills up */}
        <div className="relative w-48 h-2 bg-surface-container-high overflow-hidden border border-[#262626] rounded-full">
          <motion.div 
            className="absolute left-0 top-0 h-full bg-primary-fixed"
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.05 }}
          />
        </div>

        {/* Loading percentage */}
        <div className="font-label-bold text-sm tracking-widest text-on-surface-variant">
          {percent}%
        </div>
      </div>
    </motion.div>
  );
}
