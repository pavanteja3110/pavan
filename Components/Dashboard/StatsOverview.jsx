
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BarChart3, FileText, Target, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function StatsOverview({ evaluations, resumes, jobDescriptions }) {
  const averageScore = evaluations.length > 0 
    ? evaluations.reduce((sum, evaluation) => sum + evaluation.relevance_score, 0) / evaluations.length 
    : 0;

  const highScoreCount = evaluations.filter(evaluation => evaluation.relevance_score >= 80).length;
  const mediumScoreCount = evaluations.filter(evaluation => evaluation.relevance_score >= 60 && evaluation.relevance_score < 80).length;
  const lowScoreCount = evaluations.filter(evaluation => evaluation.relevance_score < 60).length;

  const stats = [
    {
      title: "Total Resumes",
      value: resumes.length,
      icon: FileText,
      gradient: "from-blue-500 via-blue-600 to-cyan-500",
      shadowColor: "shadow-blue-500/25",
      bgGradient: "from-blue-50 to-cyan-50"
    },
    {
      title: "Job Descriptions",
      value: jobDescriptions.length,
      icon: Target,
      gradient: "from-purple-500 via-purple-600 to-pink-500", 
      shadowColor: "shadow-purple-500/25",
      bgGradient: "from-purple-50 to-pink-50"
    },
    {
      title: "Total Evaluations",
      value: evaluations.length,
      icon: BarChart3,
      gradient: "from-green-500 via-green-600 to-emerald-500",
      shadowColor: "shadow-green-500/25",
      bgGradient: "from-green-50 to-emerald-50"
    },
    {
      title: "Average Score",
      value: `${averageScore.toFixed(1)}%`,
      icon: TrendingUp,
      gradient: "from-orange-500 via-orange-600 to-yellow-500",
      shadowColor: "shadow-orange-500/25",
      bgGradient: "from-orange-50 to-yellow-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            delay: index * 0.15,
            duration: 0.6,
            type: "spring",
            stiffness: 100
          }}
          whileHover={{ 
            y: -10, 
            scale: 1.05,
            transition: { duration: 0.3 }
          }}
        >
          <Card className={`glass-effect border-0 ${stat.shadowColor} shadow-2xl card-hover relative overflow-hidden`}>
            {/* Animated Background Gradient */}
            <motion.div
              animate={{
                background: [
                  `linear-gradient(45deg, ${stat.gradient})`,
                  `linear-gradient(135deg, ${stat.gradient})`,
                  `linear-gradient(225deg, ${stat.gradient})`,
                  `linear-gradient(315deg, ${stat.gradient})`,
                  `linear-gradient(45deg, ${stat.gradient})`
                ]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 opacity-5"
            />
            
            <CardHeader className="flex flex-row items-center justify-between pb-3 relative z-10">
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{stat.title}</p>
              <motion.div 
                className={`p-3 rounded-2xl bg-gradient-to-r ${stat.gradient} shadow-lg`}
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  delay: index * 0.2
                }}
                whileHover={{
                  scale: 1.2,
                  rotate: 15,
                  transition: { duration: 0.2 }
                }}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </motion.div>
            </CardHeader>
            <CardContent className="relative z-10">
              <motion.div 
                className="text-4xl font-black text-gray-900 mb-2"
                animate={{ 
                  scale: [1, 1.05, 1],
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  delay: index * 0.3
                }}
              >
                {stat.value}
              </motion.div>
              {stat.title === "Average Score" && evaluations.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="flex gap-2 mt-3"
                >
                  <motion.div 
                    className="flex flex-col items-center text-xs"
                    whileHover={{ scale: 1.1 }}
                  >
                    <motion.div 
                      className="w-3 h-8 bg-gradient-to-t from-green-400 to-green-600 rounded-full mb-1"
                      animate={{ height: [20, 32, 20] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="text-gray-600 font-semibold">{highScoreCount}</span>
                  </motion.div>
                  <motion.div 
                    className="flex flex-col items-center text-xs"
                    whileHover={{ scale: 1.1 }}
                  >
                    <motion.div 
                      className="w-3 h-6 bg-gradient-to-t from-yellow-400 to-yellow-600 rounded-full mb-1"
                      animate={{ height: [16, 24, 16] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                    />
                    <span className="text-gray-600 font-semibold">{mediumScoreCount}</span>
                  </motion.div>
                  <motion.div 
                    className="flex flex-col items-center text-xs"
                    whileHover={{ scale: 1.1 }}
                  >
                    <motion.div 
                      className="w-3 h-4 bg-gradient-to-t from-red-400 to-red-600 rounded-full mb-1"
                      animate={{ height: [12, 16, 12] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                    />
                    <span className="text-gray-600 font-semibold">{lowScoreCount}</span>
                  </motion.div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}