import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ChatbotFAB({ onClick }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            initial={{ scale: 0, y: 100, rotate: -180 }}
            animate={{ scale: 1, y: 0, rotate: 0 }}
            transition={{ 
              type: 'spring', 
              stiffness: 260, 
              damping: 20, 
              delay: 1.5,
              duration: 0.8
            }}
            className="fixed bottom-8 right-8 z-50"
          >
            {/* Pulsing Rings */}
            <motion.div
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.7, 0, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
            />
            <motion.div
              animate={{
                scale: [1, 1.8, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
              className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
            />
            
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 8, -8, 0],
                background: [
                  "linear-gradient(45deg, #3b82f6, #8b5cf6)",
                  "linear-gradient(45deg, #8b5cf6, #ec4899)",
                  "linear-gradient(45deg, #ec4899, #f59e0b)",
                  "linear-gradient(45deg, #f59e0b, #3b82f6)"
                ]
              }}
              transition={{
                duration: 4,
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: 1
              }}
              whileHover={{
                scale: 1.15,
                rotate: 15,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                onClick={onClick}
                className="w-18 h-18 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl border-4 border-white/30 relative overflow-hidden"
                size="icon"
              >
                <motion.div
                  animate={{
                    rotate: [0, 360]
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />
                <motion.div
                  animate={{
                    y: [0, -2, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="relative z-10"
                >
                  <Bot className="w-8 h-8 text-white" />
                </motion.div>
                <motion.div
                  animate={{
                    scale: [0, 1, 0],
                    rotate: [0, 180, 360],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: 1
                  }}
                  className="absolute top-2 right-2"
                >
                  <Sparkles className="w-3 h-3 text-yellow-300" />
                </motion.div>
              </Button>
            </motion.div>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Ask AI Assistant
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}