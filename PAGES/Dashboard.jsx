
import React, { useState, useEffect } from "react";
import { Resume, JobDescription, Evaluation } from "@/entities/all";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Filter, 
  Download, 
  Upload, 
  BarChart3,
  Users,
  FileText,
  Award,
  TrendingUp,
  Eye,
  Sparkles,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import StatsOverview from "../components/dashboard/StatsOverview";
import EvaluationsList from "../components/dashboard/EvaluationsList";
import FiltersPanel from "../components/dashboard/FiltersPanel";

export default function Dashboard() {
  const [evaluations, setEvaluations] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [jobDescriptions, setJobDescriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    verdict: "all",
    scoreRange: "all",
    jobRole: "all"
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Safely load data with proper error handling
      const [evalData, resumeData, jdData] = await Promise.all([
        Evaluation.list("-created_date").catch(() => []),
        Resume.list("-created_date").catch(() => []),
        JobDescription.list("-created_date").catch(() => [])
      ]);
      setEvaluations(evalData);
      setResumes(resumeData);
      setJobDescriptions(jdData);
    } catch (error) {
      console.error("Error loading data:", error);
      // Set empty arrays as fallback
      setEvaluations([]);
      setResumes([]);
      setJobDescriptions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getResumeById = (id) => resumes.find(r => r.id === id);
  const getJobDescriptionById = (id) => jobDescriptions.find(jd => jd.id === id);

  const filteredEvaluations = evaluations.filter(evaluation => {
    const resume = getResumeById(evaluation.resume_id);
    const jd = getJobDescriptionById(evaluation.job_description_id);
    
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        resume?.student_name?.toLowerCase().includes(searchLower) ||
        jd?.title?.toLowerCase().includes(searchLower) ||
        jd?.company?.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    if (filters.verdict !== "all" && evaluation.verdict !== filters.verdict) {
      return false;
    }

    if (filters.scoreRange !== "all") {
      const score = evaluation.relevance_score;
      switch (filters.scoreRange) {
        case "high": return score >= 80;
        case "medium": return score >= 60 && score < 80;
        case "low": return score < 60;
        default: return true;
      }
    }

    return true;
  });

  const exportResults = () => {
    if (filteredEvaluations.length === 0) {
      alert("No data to export. Please upload resumes and job descriptions first.");
      return;
    }

    const csvData = filteredEvaluations.map(evaluation => {
      const resume = getResumeById(evaluation.resume_id);
      const jd = getJobDescriptionById(evaluation.job_description_id);
      return {
        'Student Name': resume?.student_name || 'N/A',
        'Job Title': jd?.title || 'N/A',
        'Company': jd?.company || 'N/A',
        'Relevance Score': evaluation.relevance_score,
        'Verdict': evaluation.verdict,
        'Matching Skills': evaluation.matching_skills?.join(', ') || '',
        'Missing Skills': evaluation.missing_skills?.join(', ') || '',
        'Date Evaluated': new Date(evaluation.created_date).toLocaleDateString()
      };
    });

    const headers = Object.keys(csvData[0] || {});
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => JSON.stringify(row[header])).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `resume_evaluations_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 p-6 relative">
      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
        >
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl font-bold text-gray-900 mb-2 gradient-text"
            >
              Resume Evaluation Dashboard
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-gray-600 text-xl flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-blue-500" />
              AI-powered analysis of student resumes against job requirements
            </motion.p>
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex gap-3 w-full md:w-auto"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={exportResults}
                disabled={filteredEvaluations.length === 0}
                className="flex-1 md:flex-none hover:bg-blue-50 border-blue-200 glass-effect group"
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="group-hover:animate-spin"
                >
                  <Download className="w-4 h-4 mr-2" />
                </motion.div>
                Export Results
              </Button>
            </motion.div>
            <Link to={createPageUrl("Upload")} className="flex-1 md:flex-none">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 shadow-2xl animate-glow">
                  <Zap className="w-4 h-4 mr-2" />
                  New Upload
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <StatsOverview 
            evaluations={evaluations}
            resumes={resumes}
            jobDescriptions={jobDescriptions}
          />
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="glass-effect rounded-3xl p-8 shadow-2xl border border-white/50"
        >
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <motion.div 
              className="relative flex-1"
              whileFocus={{ scale: 1.02 }}
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2"
              >
                <Search className="text-gray-400 w-6 h-6" />
              </motion.div>
              <Input
                placeholder="Search by student name, job title, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 border-gray-200/60 focus:border-blue-400 focus:ring-blue-400/20 text-lg glass-effect"
              />
            </motion.div>
            <FiltersPanel filters={filters} onFiltersChange={setFilters} />
          </div>
        </motion.div>

        {/* Results Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="glass-effect rounded-3xl overflow-hidden shadow-2xl border border-white/50"
        >
          <div className="p-8 border-b border-gray-200/50">
            <div className="flex items-center justify-between">
              <motion.h2 
                className="text-3xl font-bold text-gray-900 flex items-center gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <BarChart3 className="w-8 h-8 text-blue-600" />
                </motion.div>
                Evaluation Results
              </motion.h2>
              <motion.div 
                className="text-sm text-gray-500 bg-gray-100/70 px-4 py-2 rounded-full"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 }}
              >
                Showing {filteredEvaluations.length} of {evaluations.length} evaluations
              </motion.div>
            </div>
          </div>
          
          <EvaluationsList
            evaluations={filteredEvaluations}
            resumes={resumes}
            jobDescriptions={jobDescriptions}
            isLoading={isLoading}
          />
        </motion.div>
      </div>
    </div>
  );
}
