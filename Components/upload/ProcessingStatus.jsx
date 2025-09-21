import React from 'react';
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Zap, Brain, FileText, CheckCircle } from "lucide-react";

export default function ProcessingStatus({ progress, currentStep }) {
  const steps = [
    { id: 1, label: "Uploading files", icon: FileText, threshold: 10 },
    { id: 2, label: "Extracting content", icon: FileText, threshold: 30 },
    { id: 3, label: "Saving data", icon: CheckCircle, threshold: 50 },
    { id: 4, label: "AI evaluation", icon: Brain, threshold: 70 },
    { id: 5, label: "Complete", icon: CheckCircle, threshold: 100 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-effect rounded-2xl shadow-xl"
    >
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Zap className="w-8 h-8 text-white" />
            </motion.div>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Processing Files</h2>
        <p className="text-gray-600">AI is analyzing your documents...</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-gray-700">{currentStep}</span>
            <span className="text-gray-500">{progress}%</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        <div className="grid grid-cols-5 gap-2">
          {steps.map((step) => {
            const isActive = progress >= step.threshold;
            const isCurrent = progress >= (steps[step.id - 2]?.threshold || 0) && progress < step.threshold;
            
            return (
              <div key={step.id} className="text-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 mx-auto transition-all ${
                  isActive 
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                    : isCurrent
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white animate-pulse'
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  <step.icon className="w-5 h-5" />
                </div>
                <p className={`text-xs font-medium ${
                  isActive || isCurrent ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {step.label}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </motion.div>
  );
}