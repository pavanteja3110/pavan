import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SeparateFileUploadZone({ 
  title, 
  subtitle, 
  acceptTypes, 
  onFilesSelect, 
  files, 
  onRemoveFile, 
  icon: Icon, 
  color 
}) {
  const fileInputRef = React.useRef(null);
  const [dragActive, setDragActive] = React.useState(false);

  const colorClasses = {
    blue: {
      gradient: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-400',
      text: 'text-blue-600',
      hover: 'hover:border-blue-500'
    },
    purple: {
      gradient: 'from-purple-500 to-purple-600', 
      bg: 'bg-purple-50',
      border: 'border-purple-400',
      text: 'text-purple-600',
      hover: 'hover:border-purple-500'
    }
  };

  const colors = colorClasses[color];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    onFilesSelect(droppedFiles);
  };

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files);
    onFilesSelect(selectedFiles);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptTypes}
        onChange={handleFileInput}
        className="hidden"
      />

      {/* Upload Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-300 cursor-pointer ${
          dragActive 
            ? `${colors.border} ${colors.bg}` 
            : `border-gray-300 hover:border-gray-400 ${colors.hover}`
        }`}
        onClick={handleBrowseClick}
      >
        <div className="text-center">
          <motion.div
            animate={{ y: dragActive ? -5 : 0 }}
            transition={{ duration: 0.2 }}
            className={`w-14 h-14 mx-auto mb-4 bg-gradient-to-r ${colors.gradient} rounded-xl flex items-center justify-center shadow-lg`}
          >
            <Icon className="w-7 h-7 text-white" />
          </motion.div>
          
          <h3 className={`text-lg font-bold ${colors.text} mb-2`}>
            {dragActive ? "Drop files here" : title}
          </h3>
          <p className="text-gray-600 mb-4 text-sm">
            {subtitle}
          </p>
          
          <Button
            type="button"
            variant="outline"
            className={`${colors.text} border-current hover:${colors.bg}`}
          >
            <Upload className="w-4 h-4 mr-2" />
            Browse Files
          </Button>
        </div>
      </div>

      {/* Uploaded Files List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <h4 className="font-semibold text-gray-900 flex items-center gap-2 text-sm">
              <CheckCircle className={`w-4 h-4 ${colors.text}`} />
              Uploaded Files ({files.length})
            </h4>
            
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {files.map((file, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Icon className={`w-5 h-5 ${colors.text} flex-shrink-0`} />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 text-sm truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFile(index);
                    }}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
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