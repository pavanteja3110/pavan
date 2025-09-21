import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function FileUploadZone({ onFileSelect, dragActive, uploadedFiles, onRemoveFile }) {
  const fileInputRef = React.useRef(null);

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const getFileIcon = (file) => {
    if (file.name.toLowerCase().includes('resume') || file.name.toLowerCase().includes('cv')) {
      return '👤';
    }
    return '💼';
  };

  const getFileType = (file) => {
    if (file.name.toLowerCase().includes('resume') || file.name.toLowerCase().includes('cv')) {
      return 'Resume';
    }
    return 'Job Description';
  };

  return (
    <div className="space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.docx,.zip"
        onChange={onFileSelect}
        className="hidden"
      />

      {/* Upload Zone */}
      <div
        className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ${
          dragActive 
            ? "border-blue-400 bg-blue-50" 
            : "border-gray-300 hover:border-gray-400 bg-white"
        }`}
      >
        <div className="text-center">
          <motion.div
            animate={{ y: dragActive ? -5 : 0 }}
            transition={{ duration: 0.2 }}
            className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg"
          >
            <Upload className="w-10 h-10 text-white" />
          </motion.div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {dragActive ? "Drop your files here" : "Upload Files"}
          </h3>
          <p className="text-gray-600 mb-6">
            Drag & drop your resumes and job descriptions, or click to browse
          </p>
          
          <Button
            onClick={handleBrowseClick}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
            size="lg"
          >
            Browse Files
          </Button>
          
          <p className="text-xs text-gray-500 mt-4">
            Supports PDF, DOCX, and ZIP files
          </p>
        </div>
      </div>

      {/* Uploaded Files List */}
      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Uploaded Files ({uploadedFiles.length})
            </h4>
            
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{getFileIcon(file)}</div>
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {getFileType(file)}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveFile(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}