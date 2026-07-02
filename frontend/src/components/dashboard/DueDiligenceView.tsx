"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Upload, FileText, CheckCircle2, AlertCircle, Clock, BarChart4 } from "lucide-react";
import { InvestmentMemo } from "@/components/InvestmentMemo";

type DiligenceCase = {
  id: string;
  deal_id: string;
  startup_id: string;
  startup_name: string;
  status: string;
  health_score: number | null;
};

type DiligenceDocument = {
  id: string;
  file_name: string;
  file_type: string | null;
  status: string;
  created_at: string;
};

export default function DueDiligenceView() {
  const queryClient = useQueryClient();
  const [selectedCaseId, setSelectedCaseId] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Fetch all Due Diligence Cases
  const { data: cases = [], isLoading: isCasesLoading } = useQuery<DiligenceCase[]>({
    queryKey: ["diligence-cases"],
    queryFn: async () => {
      const res = await apiClient.get("/api/v1/due-diligence");
      return res.data;
    }
  });

  React.useEffect(() => {
    if (cases.length > 0 && !selectedCaseId) {
      setSelectedCaseId(cases[0].id);
    }
  }, [cases, selectedCaseId]);

  const activeCase = cases.find((c) => c.id === selectedCaseId);

  // Fetch Documents for selected Case
  const { data: documents = [], isLoading: isDocsLoading } = useQuery<DiligenceDocument[]>({
    queryKey: ["diligence-documents", selectedCaseId],
    queryFn: async () => {
      if (!selectedCaseId) return [];
      const res = await apiClient.get(`/api/v1/due-diligence/${selectedCaseId}/documents`);
      return res.data;
    },
    enabled: !!selectedCaseId
  });

  // Upload Mutation
  const uploadMutation = useMutation({
    mutationFn: async (uploadFile: File) => {
      const formData = new FormData();
      formData.append("file", uploadFile);
      const res = await apiClient.post(
        `/api/v1/due-diligence/${selectedCaseId}/documents/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diligence-documents", selectedCaseId] });
      queryClient.invalidateQueries({ queryKey: ["diligence-cases"] }); // Refresh health scores
      setFile(null);
      alert("Document uploaded successfully. AI processing has started in the background.");
    },
    onError: (err) => {
      console.error(err);
      alert("Failed to upload document. Ensure file type is correct and size limit is respected.");
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !selectedCaseId) return;
    setUploading(true);
    try {
      await uploadMutation.mutateAsync(file);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Due Diligence Audit Center</h2>
        <p className="text-xs text-slate-400 mt-0.5">Upload materials, audit financial logs, and review automated AI memos.</p>
      </div>

      {isCasesLoading ? (
        <div className="p-8 text-center text-slate-400 text-xs">Loading active projects...</div>
      ) : cases.length === 0 ? (
        <div className="p-8 text-center bg-[#0b0e14] border border-[#161c28] rounded-xl text-slate-400 text-xs">
          No active due diligence projects found. Start by reviewing startups and moving them to the Diligence stage.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left panel - Case selector & Upload Document */}
          <div className="space-y-6 lg:col-span-1">
            
            {/* Select Diligence Case */}
            <div className="bg-[#0b0e14] border border-[#161c28] p-4 rounded-xl space-y-3">
              <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">Select Startup Project</label>
              <select
                value={selectedCaseId}
                onChange={(e) => setSelectedCaseId(e.target.value)}
                className="w-full bg-[#101522] border border-[#1c2438] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                {cases.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.startup_name} ({c.status})
                  </option>
                ))}
              </select>

              {activeCase && (
                <div className="border-t border-[#1c2438] pt-3 mt-3 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Health Index:</span>
                  <span className={`font-bold ${activeCase.health_score && activeCase.health_score > 70 ? "text-emerald-400" : "text-amber-400"}`}>
                    {activeCase.health_score || "TBD"}/100
                  </span>
                </div>
              )}
            </div>

            {/* Document Uploader */}
            <div className="bg-[#0b0e14] border border-[#161c28] p-5 rounded-xl space-y-4 shadow-md">
              <div className="text-center pb-2">
                <h4 className="text-xs font-bold text-white">Upload Ingestion Files</h4>
                <p className="text-[10px] text-slate-500 mt-1">Ingest Pitch Decks, Financial Reports, or Cap Tables.</p>
              </div>

              <div className="border border-dashed border-[#1c2438] hover:border-indigo-500/50 bg-[#0d121c]/40 rounded-lg p-6 text-center cursor-pointer transition-colors relative">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept=".pdf,.docx,.xlsx,.csv,.pptx"
                />
                <Upload className="w-8 h-8 mx-auto text-indigo-400 mb-2" />
                <span className="block text-[10px] text-slate-300 font-medium">
                  {file ? file.name : "Drag & Drop or Click to browse"}
                </span>
                <span className="block text-[8px] text-slate-500 mt-1">PDF, DOCX, XLSX, CSV, PPTX up to 25MB</span>
              </div>

              <button
                onClick={handleUpload}
                disabled={!file || uploading || !selectedCaseId}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold py-2 rounded-lg transition-colors cursor-pointer disabled:opacity-40"
              >
                {uploading ? "Analyzing Document..." : "Analyze Ingested File"}
              </button>
            </div>

            {/* Uploaded Documents List */}
            <div className="bg-[#0b0e14] border border-[#161c28] p-4 rounded-xl space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider text-slate-400">Uploaded Materials</h4>
              
              {isDocsLoading ? (
                <div className="text-center text-[10px] text-slate-500 py-4">Retrieving documents...</div>
              ) : documents.length === 0 ? (
                <div className="text-center text-[10px] text-slate-600 italic py-4">No documents uploaded yet.</div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {documents.map((doc) => (
                    <div key={doc.id} className="bg-[#101522] border border-[#1c2438] p-2.5 rounded-lg flex items-center justify-between">
                      <div className="flex items-center space-x-2 min-w-0">
                        <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[10px] font-semibold text-slate-300 truncate">{doc.file_name}</p>
                          <p className="text-[8px] text-slate-500 mt-0.5">Uploaded recently</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1.5 shrink-0">
                        {doc.status === "Completed" ? (
                          <span className="flex items-center text-[8px] font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                            <CheckCircle2 className="w-2.5 h-2.5 mr-0.5" /> Ready
                          </span>
                        ) : doc.status === "Processing" ? (
                          <span className="flex items-center text-[8px] font-semibold text-indigo-400 bg-indigo-950/40 border border-indigo-500/20 px-1.5 py-0.5 rounded animate-pulse">
                            <Clock className="w-2.5 h-2.5 mr-0.5" /> Reviewing
                          </span>
                        ) : (
                          <span className="flex items-center text-[8px] font-semibold text-amber-400 bg-amber-950/40 border border-amber-500/20 px-1.5 py-0.5 rounded">
                            <AlertCircle className="w-2.5 h-2.5 mr-0.5" /> Queue
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right panel - Scorecards & Memos */}
          <div className="lg:col-span-2 space-y-6 bg-[#0b0e14] border border-[#161c28] p-6 rounded-xl shadow-lg">
            {activeCase ? (
              <InvestmentMemo />
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                <BarChart4 className="w-12 h-12 text-slate-700 mb-2 animate-bounce" />
                <p className="text-xs">Select a startup project on the left to review metrics.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
