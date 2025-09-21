import React from 'react';
import { motion } from 'framer-motion';

export default function MorphingBlob({ className = "" }) {
  return (
    <motion.div
      animate={{
        borderRadius: [
          "60% 40% 30% 70% / 60% 30% 70% 40%",
          "30% 60% 70% 40% / 50% 60% 30% 60%",
          "70% 30% 50% 60% / 40% 70% 60% 30%",
          "60% 40% 30% 70% / 60% 30% 70% 40%"
        ],
        scale: [1, 1.1, 0.9, 1],
        rotate: [0, 90, 180, 270, 360]
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={`absolute ${className}`}
    />
  );
}