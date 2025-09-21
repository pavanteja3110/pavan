import React from 'react';
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, FileText, Target, BarChart3, ArrowRight, Upload, Users, Building2 } from "lucide-react";

export default function ResultsPreview({ results, onNewUpload, onViewDashboard }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-effect rounded-2xl shadow-xl"
    >
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Analysis Complete!</h2>
        <p className="text-gray-600">AI comparison has been successfully completed</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Results Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-blue-600">{results.resumesProcessed}</div>
            <div className="text-xs text-blue-600 font-medium">Resumes</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-xl">
            <Building2 className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-purple-600">{results.jobDescriptionsProcessed}</div>
            <div className="text-xs text-purple-600 font-medium">Job Roles</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <BarChart3 className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-green-600">{results.evaluationsCreated}</div>
            <div className="text-xs text-green-600 font-medium">Evaluations</div>
          </div>

          <div className="text-center p-4 bg-orange-50 rounded-xl">
            <Target className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-orange-600">{results.totalComparisons}</div>
            <div className="text-xs text-orange-600 font-medium">Comparisons</div>
          </div>
        </div>

        {/* Success Message */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-green-800">Cross-Comparison Complete</h3>
              <p className="text-green-700 text-sm">
                Each resume has been evaluated against every job description with detailed AI analysis
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={onNewUpload}
            variant="outline"
            className="flex-1 hover:bg-blue-50 border-blue-200"
          >
            <Upload className="w-4 h-4 mr-2" />
            New Upload
          </Button>
          <Button
            onClick={onViewDashboard}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            View Results
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </motion.div>
  );
}