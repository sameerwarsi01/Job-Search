import React from "react";
import { FiSearch, FiBriefcase, FiRotateCcw } from "react-icons/fi";

function JobFilters({ filters, setFilters, onReset }) {
  const handleChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Filter & Job Preferences
        </span>
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1 text-xs text-violet-600 hover:text-violet-700 font-medium transition cursor-pointer"
        >
          <FiRotateCcw size={12} />
          <span>Reset Filters</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* 1. Company Search */}
        <div className="relative">
          <FiSearch className="absolute left-3 top-3 text-slate-400 text-sm" />
          <input
            type="text"
            placeholder="Search Company..."
            value={filters?.company || ""}
            onChange={(e) => handleChange("company", e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
        </div>

        {/* 2. Role Search */}
        <div className="relative">
          <FiBriefcase className="absolute left-3 top-3 text-slate-400 text-sm" />
          <input
            type="text"
            placeholder="Role / Title..."
            value={filters?.role || ""}
            onChange={(e) => handleChange("role", e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
        </div>

        {/* 3. Job Type (Full-Time vs Internship) */}
        <div>
          <select
            value={filters?.jobType || "All"}
            onChange={(e) => handleChange("jobType", e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-violet-400 cursor-pointer"
          >
            <option value="All">All Types (Jobs & Internships)</option>
            <option value="Full-time">Full-Time Only</option>
            <option value="Internship">Internship Only</option>
          </select>
        </div>

        {/* 4. Work Mode (Remote vs On-site) */}
        <div>
          <select
            value={filters?.workMode || "All"}
            onChange={(e) => handleChange("workMode", e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-violet-400 cursor-pointer"
          >
            <option value="All">All Modes (Remote & On-site)</option>
            <option value="Remote">Remote Only</option>
            <option value="On-site">On-site / Hybrid</option>
          </select>
        </div>

        {/* 5. Date Posted */}
        <div>
          <select
            value={filters?.datePosted || "All"}
            onChange={(e) => handleChange("datePosted", e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-violet-400 cursor-pointer"
          >
            <option value="All">Any Time</option>
            <option value="24h">Past 24 Hours</option>
            <option value="7d">Past 7 Days</option>
            <option value="30d">Past 30 Days</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default JobFilters;