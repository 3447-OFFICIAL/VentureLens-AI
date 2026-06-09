"use client";

import { useState } from "react";
// We will import button, card, input once shadcn creates them.
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

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
    
    // Stub upload logic connecting to backend
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      // In production, point toNEXT_PUBLIC_API_URL/api/documents/upload
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
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-100">
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Upload Startup Document</h2>
          <p className="text-sm text-gray-500">Upload pitch decks, financials, or cap tables for AI Due Diligence.</p>
        </div>
        
        <div className="space-y-2">
          <input 
            type="file" 
            onChange={handleFileChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
        
        <button 
          onClick={handleUpload} 
          disabled={!file || uploading}
          className="w-full py-2 px-4 bg-gray-900 text-white rounded-md font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {uploading ? "Analyzing..." : "Analyze Document"}
        </button>
      </div>
    </div>
  );
}
