import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Rocket, Trash2, Eye, Search, Calendar, Clock, CheckCircle, 
  XCircle, TrendingUp, Filter, ArrowUpDown, MapPin, 
  CalendarDays, ChevronDown, Check, SortAsc, SortDesc
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import EntrepreneurNavbar from './EntrepreneurNavbar';
import api from '../Services/api'; 

const MySubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);

  const userId = localStorage.getItem('userId');

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/startupSubmission/getSubmissionsByUserId/${userId}`);
      setSubmissions(response.data);
    } catch (error) {
      toast.error("Failed to load ventures.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchSubmissions();
  }, [userId]);

  const handleDelete = async () => {
    try {
      await api.delete(`/startupSubmission/deleteStartupSubmission/${deleteId}`);
      setSubmissions(submissions.filter(s => s._id !== deleteId));
      setDeleteId(null);
      toast.success('Submission retracted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  // --- FIX 1: Mapping the Badge to Backend Enum Strings ---
  const getStatusBadge = (status) => {
    const s = {
      "Pending": { text: "PENDING", color: "text-blue-600", bg: "bg-blue-50" },
      "Approved": { text: "APPROVED", color: "text-emerald-600", bg: "bg-emerald-50" },
      "Rejected": { text: "REJECTED", color: "text-rose-600", bg: "bg-rose-50" }
    }[status] || { text: "UNKNOWN", color: "text-gray-600", bg: "bg-gray-50" };
    
    return (
      <div className={`px-3 py-1 rounded-lg font-black text-[9px] tracking-widest ${s.bg} ${s.color} border border-current/10`}>
        {s.text}
      </div>
    );
  };

  // --- FIX 2: Processing Data with Schema Property Names ---
  const processedData = submissions
    .filter(item => {
      // Use address or category if available for searching
      const searchTarget = (item.address || "").toLowerCase();
      const matchesSearch = searchTarget.includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "funding-high") return b.expectedFunding - a.expectedFunding;
      if (sortBy === "funding-low") return a.expectedFunding - b.expectedFunding;
      if (sortBy === "potential") return b.marketPotential - a.marketPotential;
      return new Date(b.submissionDate) - new Date(a.submissionDate);
    });

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-20">
      <EntrepreneurNavbar />
      <Toaster />

      {/* Hero Section */}
      <section className="bg-[#003366] pt-28 pb-20 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-white">
          <div>
            <h1 className="text-4xl font-black">My Ventures</h1>
            <p className="opacity-70">Strategic overview of your active proposals.</p>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 -mt-10">
        {/* Search Bar */}
        <div className="bg-white p-3 rounded-3xl shadow-sm border mb-10">
            <input 
              className="w-full px-5 py-2 outline-none" 
              placeholder="Search by location..."
              onChange={(e) => setSearch(e.target.value)}
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {processedData.map((sub) => (
              <motion.div key={sub._id} className="bg-white p-6 rounded-[2rem] shadow-sm border group">
                <div className="flex justify-between items-center mb-5">
                  <Rocket className="text-blue-600" size={20} />
                  {getStatusBadge(sub.status)}
                </div>

                <div className="mb-4">
                  <h3 className="text-base font-black text-slate-800">Startup Proposal</h3>
                  <div className="flex items-center gap-2 text-blue-500 text-[10px] font-bold">
                    <MapPin size={12} /> {sub.address}
                  </div>
                </div>

                {/* --- FIX 3: Using marketPotential --- */}
                <div className="mb-5 space-y-1">
                  <div className="flex justify-between text-[10px] font-black uppercase">
                    <span>Market Potential</span>
                    <span className="text-emerald-600">{sub.marketPotential}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div style={{ width: `${sub.marketPotential}%` }} className="h-full bg-emerald-500" />
                  </div>
                </div>

                {/* --- FIX 4: Using expectedFunding and launchYear --- */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl mb-6">
                  <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase">Funding Ask</p>
                    <p className="text-sm font-black">₹{sub.expectedFunding?.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase">Est. Launch</p>
                    <p className="text-sm font-black">{new Date(sub.launchYear).getFullYear()}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => setSelectedProfile(sub)} className="flex-1 bg-[#003366] text-white py-3 rounded-xl font-black text-[10px]">
                    FULL DETAILS
                  </button>
                  {sub.status === "Pending" && (
                    <button onClick={() => setDeleteId(sub._id)} className="px-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-colors">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default MySubmissions;