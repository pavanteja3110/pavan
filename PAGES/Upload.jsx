
import React, { useState, useCallback, useRef, useEffect } from "react"; // Added useEffect
import { Resume, JobDescription, Evaluation } from "@/entities/all";
import { UploadFile, ExtractDataFromUploadedFile, InvokeLLM } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AlertCircle, ArrowLeft, FileText, Zap, Users, Building2, MessageSquareText, Send, X } from "lucide-react"; // Added MessageSquareText, Send, X
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion"; // Added AnimatePresence
import { Input } from "@/components/ui/input"; // Assuming shadcn/ui Input component path
import { ScrollArea } from "@/components/ui/scroll-area"; // Assuming shadcn/ui ScrollArea component path

import SeparateFileUploadZone from "../components/upload/SeparateFileUploadZone";
import ProcessingStatus from "../components/upload/ProcessingStatus";
import ResultsPreview from "../components/upload/ResultsPreview";

export default function UploadPage() {
  const navigate = useNavigate();
  const [resumeFiles, setResumeFiles] = useState([]);
  const [jobDescriptionFiles, setJobDescriptionFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  // Chatbot states
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { type: "bot", text: "Hello! I'm your AI assistant. How can I help you with resume and job description comparison today?" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatScrollRef = useRef(null); // Ref for auto-scrolling chat

  // Auto-scroll chat to bottom when messages change or chatbot opens
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, showChatbot]);

  const handleResumeFiles = (files) => {
    const validFiles = files.filter(file =>
      file.type === "application/pdf" ||
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );

    if (validFiles.length === 0) {
      setError("Please upload PDF or DOCX files for resumes");
      return;
    }

    setResumeFiles(validFiles);
    setError(null);
  };

  const handleJobDescriptionFiles = (files) => {
    const validFiles = files.filter(file =>
      file.type === "application/pdf" ||
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );

    if (validFiles.length === 0) {
      setError("Please upload PDF or DOCX files for job descriptions");
      return;
    }

    setJobDescriptionFiles(validFiles);
    setError(null);
  };

  const removeResumeFile = (index) => {
    setResumeFiles(files => files.filter((_, i) => i !== index));
  };

  const removeJobDescriptionFile = (index) => {
    setJobDescriptionFiles(files => files.filter((_, i) => i !== index));
  };

  const processFiles = async () => {
    if (resumeFiles.length === 0 || jobDescriptionFiles.length === 0) {
      setError("Please upload both resumes and job descriptions to start comparison");
      return;
    }

    setProcessing(true);
    setProgress(0);
    setError(null);

    try {
      // Step 1: Upload all files
      setCurrentStep("Uploading files...");
      setProgress(10);

      const resumeUploads = await Promise.all(
        resumeFiles.map(file => UploadFile({ file }))
      );
      const jobDescriptionUploads = await Promise.all(
        jobDescriptionFiles.map(file => UploadFile({ file }))
      );

      setProgress(25);

      // Step 2: Extract resume content
      setCurrentStep("Extracting resume content...");

      const resumes = [];
      for (let i = 0; i < resumeUploads.length; i++) {
        const { file_url } = resumeUploads[i];
        const fileName = resumeFiles[i].name;

        const result = await ExtractDataFromUploadedFile({
          file_url,
          json_schema: Resume.schema()
        });

        if (result.status === "success") {
          const resume = await Resume.create({
            ...result.output,
            file_url,
            file_name: fileName
          });
          resumes.push(resume);
        }
      }

      setProgress(45);

      // Step 3: Extract job description content
      setCurrentStep("Extracting job description content...");

      const jobDescriptions = [];
      for (let i = 0; i < jobDescriptionUploads.length; i++) {
        const { file_url } = jobDescriptionUploads[i];

        const result = await ExtractDataFromUploadedFile({
          file_url,
          json_schema: JobDescription.schema()
        });

        if (result.status === "success") {
          const jd = await JobDescription.create({
            ...result.output,
            file_url
          });
          jobDescriptions.push(jd);
        }
      }

      setProgress(65);

      // Step 4: Run AI comparisons
      setCurrentStep("Running AI comparison analysis...");

      const evaluations = [];
      const totalComparisons = resumes.length * jobDescriptions.length;
      let completedComparisons = 0;

      for (const resume of resumes) {
        for (const jd of jobDescriptions) {
          const evaluationResult = await evaluateResume(resume, jd);
          const evaluation = await Evaluation.create(evaluationResult);
          evaluations.push(evaluation);

          completedComparisons++;
          const comparisonProgress = 65 + (completedComparisons / totalComparisons) * 30;
          setProgress(comparisonProgress);
        }
      }

      setProgress(100);
      setCurrentStep("Analysis complete!");

      setResults({
        resumesProcessed: resumes.length,
        jobDescriptionsProcessed: jobDescriptions.length,
        evaluationsCreated: evaluations.length,
        totalComparisons: totalComparisons
      });

    } catch (error) {
      console.error("Processing error:", error);
      setError("Error processing files. Please try again.");
    }

    setProcessing(false);
  };

  const evaluateResume = async (resume, jobDescription) => {
    const prompt = `
    Evaluate this resume against the job description and provide a detailed analysis:

    RESUME:
    Name: ${resume.student_name}
    Skills: ${resume.skills?.join(', ') || 'Not specified'}
    Experience: ${resume.experience || 'Not specified'}
    Projects: ${resume.projects || 'Not specified'}
    Education: ${resume.education || 'Not specified'}

    JOB DESCRIPTION:
    Title: ${jobDescription.title}
    Company: ${jobDescription.company}
    Required Skills: ${jobDescription.required_skills?.join(', ') || 'Not specified'}
    Description: ${jobDescription.description}

    Provide a comprehensive evaluation including:
    1. Relevance score (0-100)
    2. Verdict (high/medium/low suitability)
    3. Matching skills
    4. Missing critical skills
    5. Resume strengths for this position
    6. Specific improvement suggestions
    7. Detailed feedback

    Focus on skill alignment, experience relevance, and potential for success in the role.
    `;

    const result = await InvokeLLM({
      prompt,
      response_json_schema: {
        type: "object",
        properties: {
          relevance_score: { type: "number", minimum: 0, maximum: 100 },
          verdict: { type: "string", enum: ["high", "medium", "low"] },
          matching_skills: { type: "array", items: { type: "string" } },
          missing_skills: { type: "array", items: { type: "string" } },
          strengths: { type: "array", items: { type: "string" } },
          improvement_suggestions: { type: "array", items: { type: "string" } },
          detailed_feedback: { type: "string" },
          hard_match_score: { type: "number", minimum: 0, maximum: 100 },
          semantic_match_score: { type: "number", minimum: 0, maximum: 100 }
        }
      }
    });

    return {
      resume_id: resume.id,
      job_description_id: jobDescription.id,
      ...result
    };
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const newUserMessage = { type: "user", text: chatInput };
    setChatMessages((prev) => [...prev, newUserMessage]);
    setChatInput("");
    setChatLoading(true);

    try {
      const chatbotPrompt = `
      You are a helpful assistant for a resume and job description comparison tool. Your goal is to guide the user through the process, answer their questions about the application's features, and provide assistance regarding resume/job description content or analysis. Keep your answers concise and relevant to the context of the application. If a question is outside your scope (e.g., asking about current events), politely state you can only assist with the application.

      User's question: "${newUserMessage.text}"

      Consider the current state of the application:
      - Is the user currently processing files: ${processing}
      - Number of resume files uploaded: ${resumeFiles.length}
      - Number of job description files uploaded: ${jobDescriptionFiles.length}
      - Has a comparison been run and results are available: ${!!results}
      - Any current error: ${error ? error : "None"}

      Provide a helpful and concise response in the language of the user's question.
      `;

      const response = await InvokeLLM({
        prompt: chatbotPrompt,
        response_json_schema: {
          type: "object",
          properties: {
            answer: { type: "string", description: "The chatbot's answer to the user's question." }
          },
          required: ["answer"]
        }
      });

      if (response && response.answer) {
        setChatMessages((prev) => [...prev, { type: "bot", text: response.answer }]);
      } else {
        setChatMessages((prev) => [...prev, { type: "bot", text: "I'm sorry, I couldn't get a response from the AI. Please try again." }]);
      }
    } catch (err) {
      console.error("Chatbot LLM error:", err);
      setChatMessages((prev) => [...prev, { type: "bot", text: "I'm experiencing some technical difficulties. Please try again later." }]);
    } finally {
      setChatLoading(false);
    }
  };

  const resetUpload = () => {
    setResumeFiles([]);
    setJobDescriptionFiles([]);
    setProcessing(false);
    setProgress(0);
    setCurrentStep("");
    setError(null);
    setResults(null);
  };

  const canStartProcessing = resumeFiles.length > 0 && jobDescriptionFiles.length > 0;
  const totalFiles = resumeFiles.length + jobDescriptionFiles.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6 relative"> {/* Added relative for chatbot positioning */}
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(createPageUrl("Dashboard"))}
              className="hover:bg-blue-50"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Upload & Compare</h1>
              <p className="text-gray-600 mt-1">Upload resumes and job descriptions for AI-powered comparison</p>
            </div>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {!results && (
            <>
              {/* Upload Zones */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Resume Upload Zone */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass-effect rounded-2xl shadow-xl overflow-hidden"
                >
                  <div className="p-6 border-b border-gray-200/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Student Resumes</h2>
                        <p className="text-gray-600 text-sm">Upload PDF or DOCX resume files</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <SeparateFileUploadZone
                      title="Drop resumes here"
                      subtitle="Support for PDF and DOCX files"
                      acceptTypes=".pdf,.docx"
                      onFilesSelect={handleResumeFiles}
                      files={resumeFiles}
                      onRemoveFile={removeResumeFile}
                      icon={Users}
                      color="blue"
                    />
                  </div>
                </motion.div>

                {/* Job Description Upload Zone */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass-effect rounded-2xl shadow-xl overflow-hidden"
                >
                  <div className="p-6 border-b border-gray-200/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Job Descriptions</h2>
                        <p className="text-gray-600 text-sm">Upload PDF or DOCX job description files</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <SeparateFileUploadZone
                      title="Drop job descriptions here"
                      subtitle="Support for PDF and DOCX files"
                      acceptTypes=".pdf,.docx"
                      onFilesSelect={handleJobDescriptionFiles}
                      files={jobDescriptionFiles}
                      onRemoveFile={removeJobDescriptionFile}
                      icon={Building2}
                      color="purple"
                    />
                  </div>
                </motion.div>
              </div>

              {/* Comparison Summary */}
              {canStartProcessing && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-effect rounded-2xl shadow-xl p-6"
                >
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-8">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">{resumeFiles.length}</div>
                        <div className="text-sm text-gray-600">Resumes</div>
                      </div>
                      <div className="text-2xl text-gray-400">×</div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600">{jobDescriptionFiles.length}</div>
                        <div className="text-sm text-gray-600">Job Roles</div>
                      </div>
                      <div className="text-2xl text-gray-400">=</div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">{resumeFiles.length * jobDescriptionFiles.length}</div>
                        <div className="text-sm text-gray-600">Comparisons</div>
                      </div>
                    </div>

                    <div className="flex gap-3 justify-center">
                      <Button
                        onClick={resetUpload}
                        variant="outline"
                        disabled={processing}
                      >
                        Clear All
                      </Button>
                      <Button
                        onClick={processFiles}
                        disabled={processing}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        {processing ? 'Processing...' : 'Start AI Analysis'}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </>
          )}

          {processing && (
            <ProcessingStatus
              progress={progress}
              currentStep={currentStep}
            />
          )}

          {results && (
            <ResultsPreview
              results={results}
              onNewUpload={resetUpload}
              onViewDashboard={() => navigate(createPageUrl("Dashboard"))}
            />
          )}
        </div>
      </div>

      {/* Floating Chatbot Button */}
      <motion.button
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
        onClick={() => setShowChatbot(!showChatbot)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageSquareText className="w-6 h-6" />
      </motion.button>

      {/* Chatbot Window */}
      <AnimatePresence>
        {showChatbot && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: 50 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 50, x: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-20 right-6 w-80 h-[400px] bg-white rounded-lg shadow-xl flex flex-col z-50 border border-gray-200"
          >
            <div className="flex justify-between items-center p-4 border-b bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
              <h3 className="font-semibold text-lg">AI Assistant</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowChatbot(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <ScrollArea className="flex-1 p-4 space-y-4 overflow-y-auto" ref={chatScrollRef}>
              {chatMessages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] px-4 py-2 rounded-lg text-sm ${
                      message.type === "user"
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-gray-100 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    {message.text}
                  </div>
                </motion.div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[75%] px-4 py-2 rounded-lg text-sm bg-gray-100 text-gray-800 rounded-bl-none">
                    <div className="flex items-center space-x-1">
                      <span className="animate-bounce" style={{ animationDelay: '0s' }}>.</span>
                      <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>.</span>
                      <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
                    </div>
                  </div>
                </div>
              )}
            </ScrollArea>

            <form onSubmit={handleChatSubmit} className="p-4 border-t flex items-center gap-2">
              <Input
                placeholder="Type your message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                disabled={chatLoading}
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={!chatInput.trim() || chatLoading}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
