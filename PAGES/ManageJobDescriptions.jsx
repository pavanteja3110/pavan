import React, { useState, useEffect } from 'react';
import { JobDescription, Evaluation } from '@/entities/all';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Briefcase, Building2, AlertTriangle } from 'lucide-react';
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

export default function ManageJobDescriptions() {
  const [jobDescriptions, setJobDescriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadJobDescriptions();
  }, []);

  const loadJobDescriptions = async () => {
    setIsLoading(true);
    try {
      const jdList = await JobDescription.list('-created_date');
      setJobDescriptions(jdList);
    } catch (error) {
      console.error("Error loading job descriptions:", error);
      setJobDescriptions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (jdToDelete) => {
    try {
      // Delete associated evaluations first
      const evaluations = await Evaluation.filter({ job_description_id: jdToDelete.id }).catch(() => []);
      for (const ev of evaluations) {
        await Evaluation.delete(ev.id);
      }
      
      // Then delete the job description
      await JobDescription.delete(jdToDelete.id);
      
      // Refresh list
      setJobDescriptions(jobDescriptions.filter(jd => jd.id !== jdToDelete.id));
    } catch (error) {
      console.error("Error deleting job description:", error);
      alert("Error deleting job description. Please try again.");
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
          <Briefcase className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">Manage Job Descriptions</h1>
        </motion.div>

        <Card className="glass-effect">
          <CardHeader>
            <CardTitle>All Uploaded Job Descriptions ({jobDescriptions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading job descriptions...</p>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {jobDescriptions.map(jd => (
                    <motion.div
                      key={jd.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                      className="flex items-center justify-between p-4 border rounded-lg bg-white/50"
                    >
                      <div className="flex items-center gap-3">
                        <Building2 className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-semibold">{jd.title}</p>
                          <p className="text-sm text-gray-500">{jd.company}</p>
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
                              This action cannot be undone. This will permanently delete the job description for <strong>{jd.title} at {jd.company}</strong> and all associated evaluations.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(jd)} className="bg-red-600 hover:bg-red-700">
                              Yes, delete it
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {jobDescriptions.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No job descriptions have been uploaded yet.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}