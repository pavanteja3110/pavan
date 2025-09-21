import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Target, BarChart3, Users, Building2, Zap, Star, Award } from 'lucide-react';

const FloatingIcon = ({ icon: Icon, delay = 0, color, x, y }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: [0.3, 0.6, 0.3],
      scale: [1, 1.2, 1],
      rotate: [0, 180, 360],
      x: [x, x + 20, x - 20, x],
      y: [y, y - 30, y + 20, y]
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      delay,
      ease: "easeInOut"
    }}
    className={`absolute pointer-events-none z-10`}
    style={{ left: x, top: y }}
  >
    <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center shadow-lg`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
  </motion.div>
);

export default function FloatingElements() {
  const icons = [
    { icon: FileText, color: "bg-gradient-to-r from-blue-400 to-blue-600", x: "10%", y: "20%", delay: 0 },
    { icon: Target, color: "bg-gradient-to-r from-purple-400 to-purple-600", x: "85%", y: "15%", delay: 1 },
    { icon: BarChart3, color: "bg-gradient-to-r from-green-400 to-green-600", x: "15%", y: "70%", delay: 2 },
    { icon: Users, color: "bg-gradient-to-r from-pink-400 to-pink-600", x: "80%", y: "75%", delay: 3 },
    { icon: Building2, color: "bg-gradient-to-r from-orange-400 to-orange-600", x: "50%", y: "10%", delay: 4 },
    { icon: Zap, color: "bg-gradient-to-r from-yellow-400 to-yellow-600", x: "90%", y: "45%", delay: 5 },
    { icon: Star, color: "bg-gradient-to-r from-indigo-400 to-indigo-600", x: "5%", y: "45%", delay: 6 },
    { icon: Award, color: "bg-gradient-to-r from-red-400 to-red-600", x: "70%", y: "30%", delay: 7 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {icons.map((item, index) => (
        <FloatingIcon
          key={index}
          icon={item.icon}
          color={item.color}
          x={item.x}
          y={item.y}
          delay={item.delay}
        />
      ))}
    </div>
  );
}