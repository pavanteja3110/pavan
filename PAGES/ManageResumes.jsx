import React, { useState, useEffect } from 'react';
import { Resume, Evaluation } from '@/entities/all';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Users, FileText, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function ManageResumes() {
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    setIsLoading(true);
    try {
      const resumeList = await Resume.list('-created_date');
      setResumes(resumeList);
    } catch (error) {
      console.error("Error loading resumes:", error);
      setResumes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (resumeToDelete) => {
    try {
      // Delete associated evaluations first
      const evaluations = await Evaluation.filter({ resume_id: resumeToDelete.id }).catch(() => []);
      for (const ev of evaluations) {
        await Evaluation.delete(ev.id);
      }
      
      // Then delete the resume
      await Resume.delete(resumeToDelete.id);
      
      // Refresh list
      setResumes(resumes.filter(r => r.id !== resumeToDelete.id));
    } catch (error) {
      console.error("Error deleting resume:", error);
      alert("Error deleting resume. Please try again.");
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Users className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Manage Resumes</h1>
        </motion.div>

        <Card className="glass-effect">
          <CardHeader>
            <CardTitle>All Uploaded Resumes ({resumes.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading resumes...</p>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {resumes.map(resume => (
                    <motion.div
                      key={resume.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                      className="flex items-center justify-between p-4 border rounded-lg bg-white/50"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-semibold">{resume.student_name}</p>
                          <p className="text-sm text-gray-500">{resume.file_name}</p>
                        </div>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="icon">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2">
                              <AlertTriangle className="text-red-500" />
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the resume for <strong>{resume.student_name}</strong> and all associated evaluations.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(resume)} className="bg-red-600 hover:bg-red-700">
                              Yes, delete it
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {resumes.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No resumes have been uploaded yet.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}