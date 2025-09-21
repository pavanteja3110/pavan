import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  User, 
  Building2, 
  Award, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp,
  Star,
  Target,
  TrendingUp,
  CheckCircle2,
  XCircle
} from "lucide-react";

export default function EvaluationsList({ evaluations, resumes, jobDescriptions, isLoading }) {
  const [expandedCards, setExpandedCards] = useState(new Set());

  const toggleExpanded = (evaluationId) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(evaluationId)) {
      newExpanded.delete(evaluationId);
    } else {
      newExpanded.add(evaluationId);
    }
    setExpandedCards(newExpanded);
  };

  const getVerdictColor = (verdict) => {
    switch (verdict) {
      case 'high': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className="space-y-4 p-6">
        {Array(5).fill(0).map((_, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-8 w-16 rounded-full" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (evaluations.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Target className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No evaluations yet</h3>
        <p className="text-gray-500">Upload resumes and job descriptions to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6">
      <AnimatePresence>
        {evaluations.map((evaluation) => {
          const resume = resumes.find(r => r.id === evaluation.resume_id);
          const jobDescription = jobDescriptions.find(jd => jd.id === evaluation.job_description_id);
          const isExpanded = expandedCards.has(evaluation.id);

          return (
            <motion.div
              key={evaluation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              layout
            >
              <Card className="card-hover border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                        {resume?.student_name?.[0]?.toUpperCase() || 'N'}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {resume?.student_name || 'Unknown Student'}
                        </h3>
                        <p className="text-gray-600 flex items-center gap-2 mt-1">
                          <Building2 className="w-4 h-4" />
                          {jobDescription?.title || 'Unknown Position'} at {jobDescription?.company || 'Unknown Company'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className={`text-3xl font-bold ${getScoreColor(evaluation.relevance_score)}`}>
                          {evaluation.relevance_score}
                        </div>
                        <div className="text-xs text-gray-500">SCORE</div>
                      </div>
                      
                      <Badge className={`${getVerdictColor(evaluation.verdict)} border font-medium px-3 py-1`}>
                        {evaluation.verdict === 'high' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {evaluation.verdict === 'medium' && <AlertCircle className="w-3 h-3 mr-1" />}
                        {evaluation.verdict === 'low' && <XCircle className="w-3 h-3 mr-1" />}
                        {evaluation.verdict.toUpperCase()} FIT
                      </Badge>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleExpanded(evaluation.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Progress 
                      value={evaluation.relevance_score} 
                      className="h-2"
                    />
                  </div>
                </CardHeader>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CardContent className="border-t border-gray-100 pt-4">
                        <div className="grid md:grid-cols-2 gap-6">
                          {/* Matching Skills */}
                          <div>
                            <h4 className="font-semibold text-green-700 flex items-center gap-2 mb-3">
                              <Star className="w-4 h-4" />
                              Matching Skills
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {evaluation.matching_skills?.map((skill, index) => (
                                <Badge key={index} className="bg-green-50 text-green-700 border-green-200">
                                  {skill}
                                </Badge>
                              )) || <p className="text-gray-500 text-sm">No matching skills identified</p>}
                            </div>
                          </div>

                          {/* Missing Skills */}
                          <div>
                            <h4 className="font-semibold text-red-700 flex items-center gap-2 mb-3">
                              <AlertCircle className="w-4 h-4" />
                              Missing Skills
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {evaluation.missing_skills?.map((skill, index) => (
                                <Badge key={index} className="bg-red-50 text-red-700 border-red-200">
                                  {skill}
                                </Badge>
                              )) || <p className="text-gray-500 text-sm">No missing skills identified</p>}
                            </div>
                          </div>

                          {/* Strengths */}
                          <div>
                            <h4 className="font-semibold text-blue-700 flex items-center gap-2 mb-3">
                              <Award className="w-4 h-4" />
                              Key Strengths
                            </h4>
                            <ul className="space-y-1">
                              {evaluation.strengths?.map((strength, index) => (
                                <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                                  <CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                                  {strength}
                                </li>
                              )) || <p className="text-gray-500 text-sm">No strengths identified</p>}
                            </ul>
                          </div>

                          {/* Improvement Suggestions */}
                          <div>
                            <h4 className="font-semibold text-orange-700 flex items-center gap-2 mb-3">
                              <TrendingUp className="w-4 h-4" />
                              Improvement Suggestions
                            </h4>
                            <ul className="space-y-1">
                              {evaluation.improvement_suggestions?.map((suggestion, index) => (
                                <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                                  <Target className="w-3 h-3 text-orange-500 mt-0.5 flex-shrink-0" />
                                  {suggestion}
                                </li>
                              )) || <p className="text-gray-500 text-sm">No suggestions available</p>}
                            </ul>
                          </div>
                        </div>

                        {/* Detailed Feedback */}
                        {evaluation.detailed_feedback && (
                          <div className="mt-6 pt-4 border-t border-gray-100">
                            <h4 className="font-semibold text-gray-900 mb-2">Detailed Analysis</h4>
                            <p className="text-gray-700 text-sm leading-relaxed">
                              {evaluation.detailed_feedback}
                            </p>
                          </div>
                        )}

                        {/* Score Breakdown */}
                        <div className="mt-6 pt-4 border-t border-gray-100">
                          <h4 className="font-semibold text-gray-900 mb-3">Score Breakdown</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                              <div className="text-xl font-bold text-blue-600">
                                {evaluation.hard_match_score || 0}
                              </div>
                              <div className="text-xs text-blue-600 font-medium">Hard Match</div>
                            </div>
                            <div className="text-center p-3 bg-purple-50 rounded-lg">
                              <div className="text-xl font-bold text-purple-600">
                                {evaluation.semantic_match_score || 0}
                              </div>
                              <div className="text-xs text-purple-600 font-medium">Semantic Match</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}