"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Search, ChevronDown, ChevronUp, Edit2, Trash2, Plus, X, Globe, ShieldAlert } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

type Startup = {
  id: string;
  name: string;
  domain?: string;
  vc_firm_id: string;
};

const companySchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters"),
  domain: z.string().url("Must be a valid URL").or(z.string().length(0)).optional(),
});

type CompanyFormValues = z.infer<typeof companySchema>;

export default function CompaniesView() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"name" | "domain">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Startup | null>(null);

  // Fetch Startups
  const { data: startups = [], isLoading, isError } = useQuery<Startup[]>({
    queryKey: ["startups"],
    queryFn: async () => {
      const res = await apiClient.get("/api/v1/startups");
      return res.data;
    }
  });

  // Create Startup Mutation
  const createMutation = useMutation({
    mutationFn: async (data: CompanyFormValues) => {
      const res = await apiClient.post("/api/v1/startups", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["startups"] });
      setIsAddOpen(false);
      reset();
    },
    onError: (err) => {
      alert("Error adding company. Make sure backend is running.");
    }
  });

  // Update Startup Mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CompanyFormValues }) => {
      const res = await apiClient.patch(`/api/v1/startups/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["startups"] });
      setEditingCompany(null);
    },
    onError: (err) => {
      alert("Error updating company.");
    }
  });

  // Delete Startup Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/v1/startups/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["startups"] });
    },
    onError: (err) => {
      alert("Error deleting company.");
    }
  });

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: { name: "", domain: "" }
  });

  const handleSort = (field: "name" | "domain") => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  const handleAddSubmit = (data: CompanyFormValues) => {
    createMutation.mutate(data);
  };

  const handleEditSubmit = (data: CompanyFormValues) => {
    if (editingCompany) {
      updateMutation.mutate({ id: editingCompany.id, data });
    }
  };

  const openEditModal = (company: Startup) => {
    setEditingCompany(company);
    setValue("name", company.name);
    setValue("domain", company.domain || "");
  };

  // Filter and sort startups
  const filtered = startups.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (item.domain && item.domain.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const sorted = [...filtered].sort((a, b) => {
    const valA = (sortBy === "name" ? a.name : a.domain || "").toLowerCase();
    const valB = (sortBy === "name" ? b.name : b.domain || "").toLowerCase();
    
    if (valA < valB) return sortDirection === "asc" ? -1 : 1;
    if (valA > valB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalItems = sorted.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = sorted.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white">Companies Directory</h2>
          <p className="text-xs text-slate-400 mt-0.5">Manage deal flow pipelines, web domains, and cap tables.</p>
        </div>
        <button
          onClick={() => {
            reset();
            setIsAddOpen(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3 py-2 rounded-lg flex items-center space-x-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Company</span>
        </button>
      </div>

      {/* Toolbar Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-[#0b0e14] border border-[#161c28] p-3 rounded-xl">
        <div className="w-full sm:w-72 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search company by name or domain..."
            className="w-full bg-[#101522] border border-[#1c2438] rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex space-x-2 text-xs text-slate-400">
          <span>Total: <strong className="text-slate-200">{totalItems}</strong> companies</span>
        </div>
      </div>

      {/* Datagrid Table */}
      <div className="bg-[#0b0e14] border border-[#161c28] rounded-xl overflow-hidden shadow-lg">
        {isLoading ? (
          <div className="p-8 text-center text-slate-400 text-xs">Loading companies...</div>
        ) : isError ? (
          <div className="p-8 text-center text-red-400 text-xs flex flex-col items-center justify-center space-y-2">
            <ShieldAlert className="w-8 h-8 text-red-500" />
            <span>Failed to load startups directory. Ensure backend is running.</span>
          </div>
        ) : paginatedItems.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">No companies match the criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#1c2438] text-slate-500 bg-[#0d121c]/50">
                  <th
                    className="py-3 px-4 font-semibold text-[10px] uppercase cursor-pointer select-none hover:text-slate-300"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Company Name</span>
                      {sortBy === "name" && (sortDirection === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                    </div>
                  </th>
                  <th
                    className="py-3 px-4 font-semibold text-[10px] uppercase cursor-pointer select-none hover:text-slate-300"
                    onClick={() => handleSort("domain")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Domain</span>
                      {sortBy === "domain" && (sortDirection === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                    </div>
                  </th>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase">Firm Affiliation</th>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#161c28]/50">
                {paginatedItems.map((comp) => (
                  <tr key={comp.id} className="hover:bg-[#0f1421]/30 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-200">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center font-bold text-[10px] text-indigo-400">
                          {comp.name.charAt(0)}
                        </div>
                        <span>{comp.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {comp.domain ? (
                        <a href={`https://${comp.domain}`} target="_blank" rel="noreferrer" className="flex items-center space-x-1 hover:text-indigo-400 transition-colors">
                          <Globe className="w-3 h-3 text-slate-500" />
                          <span>{comp.domain}</span>
                        </a>
                      ) : (
                        <span className="text-slate-600 font-light italic">None</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      <span className="bg-[#1c2438]/40 border border-[#2b354d] text-slate-400 text-[10px] px-2 py-0.5 rounded-full">
                        VentureLens VC
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(comp)}
                        className="p-1 text-slate-400 hover:text-indigo-400 hover:bg-[#161c28] rounded transition-colors cursor-pointer"
                        title="Edit Company"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete ${comp.name}?`)) {
                            deleteMutation.mutate(comp.id);
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-red-400 hover:bg-[#281616] rounded transition-colors cursor-pointer"
                        title="Delete Company"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-[#1c2438] px-4 py-3 bg-[#0d121c]/30 text-xs">
            <span className="text-slate-400">
              Showing page <strong className="text-slate-200">{currentPage}</strong> of <strong className="text-slate-200">{totalPages}</strong>
            </span>
            <div className="flex space-x-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-2.5 py-1 rounded bg-[#101522] border border-[#1c2438] hover:bg-[#162030] disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-slate-300"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-2.5 py-1 rounded bg-[#101522] border border-[#1c2438] hover:bg-[#162030] disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-slate-300"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0b0e14] border border-[#1c2438] w-full max-w-md p-6 rounded-xl shadow-2xl relative">
            <button
              onClick={() => setIsAddOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-base font-bold text-white mb-2">Add New Company</h3>
            <p className="text-xs text-slate-400 mb-4">Enter startup particulars for tracking and AI due diligence execution.</p>

            <form onSubmit={handleSubmit(handleAddSubmit)} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Company Name</label>
                <input
                  type="text"
                  {...register("name")}
                  className="w-full bg-[#101522] border border-[#1c2438] rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. Acme Corp"
                />
                {errors.name && <p className="text-red-400 mt-1 text-[10px]">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Website Domain</label>
                <input
                  type="text"
                  {...register("domain")}
                  className="w-full bg-[#101522] border border-[#1c2438] rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. https://acme.com"
                />
                {errors.domain && <p className="text-red-400 mt-1 text-[10px]">{errors.domain.message}</p>}
              </div>

              <button
                type="submit"
                disabled={createMutation.isPending}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              >
                {createMutation.isPending ? "Adding..." : "Add Company"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0b0e14] border border-[#1c2438] w-full max-w-md p-6 rounded-xl shadow-2xl relative">
            <button
              onClick={() => setEditingCompany(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-base font-bold text-white mb-2">Edit Company Details</h3>
            <p className="text-xs text-slate-400 mb-4">Modify company registry settings.</p>

            <form onSubmit={handleSubmit(handleEditSubmit)} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Company Name</label>
                <input
                  type="text"
                  {...register("name")}
                  className="w-full bg-[#101522] border border-[#1c2438] rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. Acme Corp"
                />
                {errors.name && <p className="text-red-400 mt-1 text-[10px]">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Website Domain</label>
                <input
                  type="text"
                  {...register("domain")}
                  className="w-full bg-[#101522] border border-[#1c2438] rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. https://acme.com"
                />
                {errors.domain && <p className="text-red-400 mt-1 text-[10px]">{errors.domain.message}</p>}
              </div>

              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              >
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
