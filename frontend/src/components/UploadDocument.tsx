"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function UploadDocument() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      console.log("Uploading file to backend...");
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate delay
      alert("File uploaded successfully and analysis started!");
    } catch (error) {
      console.error(error);
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-slate-900 border-slate-800 text-slate-100 shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-slate-200">Upload Startup Document</CardTitle>
        <CardDescription className="text-slate-400">
          Upload pitch decks, financials, or cap tables for AI Due Diligence.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <input 
            type="file" 
            onChange={handleFileChange}
            className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 cursor-pointer"
          />
        </div>
        
        <Button 
          onClick={handleUpload} 
          disabled={!file || uploading}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {uploading ? "Analyzing..." : "Analyze Document"}
        </Button>
      </CardContent>
    </Card>
  );
}
