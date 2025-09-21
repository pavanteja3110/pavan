import React from 'react';
import { motion } from 'framer-motion';

export default function TypingIndicator() {
  const bounceTransition = {
    y: {
      duration: 0.4,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeOut",
    },
  };

  return (
    <div className="flex items-center gap-1.5 p-3 bg-gray-200 rounded-full">
      <motion.span
        className="w-2 h-2 bg-gray-500 rounded-full"
        transition={{ ...bounceTransition, delay: 0 }}
        animate={{ y: ["-25%", "25%"] }}
      />
      <motion.span
        className="w-2 h-2 bg-gray-500 rounded-full"
        transition={{ ...bounceTransition, delay: 0.2 }}
        animate={{ y: ["-25%", "25%"] }}
      />
      <motion.span
        className="w-2 h-2 bg-gray-500 rounded-full"
        transition={{ ...bounceTransition, delay: 0.4 }}
        animate={{ y: ["-25%", "25%"] }}
      />
    </div>
  );
}