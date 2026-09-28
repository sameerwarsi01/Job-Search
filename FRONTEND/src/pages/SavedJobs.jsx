import { useState, useEffect } from "react";
import { FiBookmark, FiExternalLink, FiTrash2, FiBriefcase, FiMapPin } from "react-icons/fi";

const API_BASE = "http://localhost:3000/api/jobs";

function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAuthHeaders = () => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("userToken") ||
      storedUser?.token;

    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/saved`, {
        headers: getAuthHeaders(),
        credentials: "include",
      });
      const data = await res.json();
      setSavedJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load saved jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const handleRemoveSaved = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/${id}/toggle-save`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        credentials: "include",
      });
      if (res.ok) {
        setSavedJobs((prev) => prev.filter((job) => (job._id || job.id) !== id));
      }
    } catch (err) {
      console.error("Failed to remove saved job:", err);
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-8">
      {/* Page Header */}
      <div className="mb-8 flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-extrabold text-slate-800">Saved Jobs</h1>
          <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
            {savedJobs.length} Bookmarked
          </span>
        </div>
        <p className="text-sm text-slate-500">
          Jobs and internships you have shortlisted to review and apply later.
        </p>
      </div>

      {loading ? (
        <div className="mt-12 text-center text-slate-400 font-medium">
          Loading saved jobs...
        </div>
      ) : savedJobs.length === 0 ? (
        <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-14 text-center shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
            <FiBookmark size={26} />
          </div>
          <h3 className="mt-4 text-base font-semibold text-slate-800">No saved jobs yet</h3>
          <p className="mt-1 text-sm text-slate-500 max-w-sm">
            Save interesting positions from your Applications feed to track and apply whenever you are ready.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {savedJobs.map((job) => (
            <div
              key={job._id || job.id}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-violet-200 hover:shadow-md"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600 font-bold text-white shadow-sm text-base">
                      {job.company?.charAt(0).toUpperCase() || "C"}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm leading-snug">{job.company}</h4>
                      <p className="text-xs text-slate-400 font-medium">{job.jobType || "Full-time"}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveSaved(job._id || job.id)}
                    className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer"
                    title="Remove from saved"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>

                <h3 className="mt-5 font-bold text-slate-800 text-base line-clamp-1">{job.role}</h3>

                <div className="mt-3.5 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5 font-medium">
                    <FiMapPin size={13} className="text-slate-400" />
                    {job.location || "India"}
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <FiBriefcase size={13} className="text-slate-400" />
                    {job.workMode || "Remote"}
                  </span>
                </div>

                {job.salary && (
                  <div className="mt-3.5 inline-block rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    {job.salary}
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {job.priority || "Medium"} Priority
                </span>
                <a
                  href={job.jobLink || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-violet-700 cursor-pointer"
                >
                  Apply Now <FiExternalLink size={13} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SavedJobs;