import { useState, useEffect } from "react";
import SearchFilter from "../components/Jobs/SearchFilter";
import JobFilters from "../components/Jobs/JobFilters";
import JobStats from "../components/Jobs/JobStats";
import JobsTable from "../components/Jobs/JobsTable";
import AddJobModal from "../components/Jobs/AddJobModal";
import ViewJobModal from "../components/Jobs/ViewJobModal";
import { FiRefreshCw, FiZap, FiBriefcase, FiPlus } from "react-icons/fi";

const API_URL = "http://localhost:3000/api/jobs";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [viewingJob, setViewingJob] = useState(null);
  const [activeProfile, setActiveProfile] = useState({ role: "", category: "" });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const defaultFilters = {
    company: "",
    role: "",
    jobType: "All",
    workMode: "All",
    datePosted: "All",
  };
  const [filters, setFilters] = useState(defaultFilters);

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

  const fetchJobs = async () => {
    try {
      const res = await fetch(API_URL, {
        headers: getAuthHeaders(),
        credentials: "include",
      });
      const data = await res.json();
      const jobList = Array.isArray(data) ? data : data.jobs || [];
      setJobs(jobList);
      return jobList;
    } catch (error) {
      console.error("Error fetching jobs:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const handleAutoSyncJobs = async (isSilent = false) => {
    if (!isSilent) setSyncing(true);
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const userSkills = storedUser.skills || storedUser.resumeInfo?.skills || [];
      const userRole = storedUser.targetRole || "Full Stack Developer";
      const userCategory = storedUser.category || storedUser.stream || "software_it";

      setActiveProfile({ role: userRole, category: userCategory });

      const res = await fetch(`${API_URL}/sync-matched`, {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify({
          skills: userSkills,
          targetRole: userRole,
          stream: userCategory,
          category: userCategory,
        }),
      });

      const data = await res.json();

      if (data.jobs && Array.isArray(data.jobs)) {
        setJobs([...data.jobs]);
      } else {
        await fetchJobs();
      }

      if (!isSilent) {
        alert(data.message || `Matched jobs loaded for ${userRole}!`);
      }
    } catch (error) {
      console.error("Failed to sync resume matched jobs:", error);
      if (!isSilent) {
        alert("Failed to fetch live jobs from backend.");
      }
    } finally {
      if (!isSilent) setSyncing(false);
    }
  };

  useEffect(() => {
    const initializeJobs = async () => {
      await fetchJobs();

      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      if (storedUser.targetRole) {
        setActiveProfile({
          role: storedUser.targetRole,
          category: storedUser.category || "",
        });
      }

      handleAutoSyncJobs(true);
    };

    initializeJobs();
  }, []);

  const openModal = () => {
    setEditingJob(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingJob(null);
    setIsModalOpen(false);
  };

  const handleSaveJob = async (jobData) => {
    try {
      if (editingJob) {
        const targetId = editingJob._id || editingJob.id;
        const res = await fetch(`${API_URL}/${targetId}`, {
          method: "PUT",
          headers: getAuthHeaders(),
          credentials: "include",
          body: JSON.stringify(jobData),
        });
        const updatedJob = await res.json();

        setJobs((prevJobs) =>
          prevJobs.map((job) =>
            (job._id || job.id) === targetId ? updatedJob : job
          )
        );
      } else {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: getAuthHeaders(),
          credentials: "include",
          body: JSON.stringify(jobData),
        });

        if (!res.ok) {
          const errData = await res.json();
          alert(errData.message || "Failed to add job.");
          return;
        }

        const newJob = await res.json();
        setJobs((prevJobs) => [newJob, ...prevJobs]);
      }
      closeModal();
    } catch (error) {
      console.error("Error saving job:", error);
    }
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm("Are you sure you want to delete this application?")) return;

    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
        credentials: "include",
      });
      setJobs((prevJobs) => prevJobs.filter((job) => (job._id || job.id) !== id));
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          (job._id || job.id) === id ? { ...job, status: newStatus } : job
        )
      );
    } catch (error) {
      console.error("Status update error:", error);
      alert("Failed to update application status.");
    }
  };

  const handleToggleSave = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}/toggle-save`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        credentials: "include",
      });
      if (res.ok) {
        setJobs((prevJobs) =>
          prevJobs.map((job) =>
            (job._id || job.id) === id ? { ...job, isSaved: !job.isSaved } : job
          )
        );
      }
    } catch (error) {
      console.error("Error toggling save status:", error);
    }
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setIsModalOpen(true);
  };

  const handleViewJob = (job) => {
    setViewingJob(job);
  };

  const handleCloseView = () => {
    setViewingJob(null);
  };

  const filteredJobs = jobs.filter((job) => {
    const searchLower = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !searchLower ||
      (job.company?.toLowerCase() || "").includes(searchLower) ||
      (job.role?.toLowerCase() || "").includes(searchLower) ||
      (job.location?.toLowerCase() || "").includes(searchLower);

    const matchesStatus =
      selectedStatus === "All" ||
      job.status?.toLowerCase() === selectedStatus.toLowerCase();

    if (!matchesSearch || !matchesStatus) return false;

    if (
      filters.company &&
      !job.company?.toLowerCase().includes(filters.company.toLowerCase().trim())
    ) {
      return false;
    }

    if (
      filters.role &&
      !job.role?.toLowerCase().includes(filters.role.toLowerCase().trim())
    ) {
      return false;
    }

    const jobTypeVal = (filters.jobType || "All").toLowerCase();
    if (jobTypeVal !== "all") {
      const isIntern =
        (job.role || "").toLowerCase().includes("intern") ||
        (job.jobType || "").toLowerCase().includes("intern");

      if (jobTypeVal.includes("intern") && !isIntern) return false;
      if (jobTypeVal.includes("full") && isIntern) return false;
    }

    const workModeVal = (filters.workMode || "All").toLowerCase();
    if (workModeVal !== "all") {
      const isRemote =
        (job.location || "").toLowerCase().includes("remote") ||
        (job.workMode || "").toLowerCase().includes("remote");

      if (workModeVal.includes("remote") && !isRemote) return false;
      if ((workModeVal.includes("site") || workModeVal.includes("hybrid")) && isRemote) return false;
    }

    const dateFilterVal = (filters.datePosted || "All").toLowerCase();
    if (dateFilterVal !== "all" && dateFilterVal !== "any time") {
      const rawDate = job.postedAt || job.createdAt;
      const parsedDate = rawDate ? new Date(rawDate) : null;

      if (parsedDate && !isNaN(parsedDate.getTime())) {
        const diffHours = (Date.now() - parsedDate.getTime()) / (1000 * 60 * 60);

        if ((dateFilterVal.includes("24") || dateFilterVal === "24h") && diffHours > 24) return false;
        if ((dateFilterVal.includes("week") || dateFilterVal === "7d") && diffHours > 24 * 7) return false;
        if ((dateFilterVal.includes("month") || dateFilterVal === "30d") && diffHours > 24 * 30) return false;
      }
    }

    return true;
  });

  return (
    <div className="mx-auto max-w-7xl w-full p-4 sm:p-6 lg:p-8 overflow-hidden">
      {/* Header Row */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800">Applications</h1>
            {activeProfile.role && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-3 py-0.5 text-xs font-semibold text-violet-700">
                <FiBriefcase size={13} /> {activeProfile.role}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Real-time verified feed matched to your resume & career domain.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={() => handleAutoSyncJobs(false)}
            disabled={syncing}
            className="flex flex-1 sm:flex-initial items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:shadow-md disabled:opacity-50 cursor-pointer"
          >
            {syncing ? (
              <FiRefreshCw className="animate-spin" size={15} />
            ) : (
              <FiZap size={15} />
            )}
            <span>{syncing ? "Matching..." : "Sync Jobs"}</span>
          </button>

          <button
            type="button"
            onClick={openModal}
            className="flex flex-1 sm:flex-initial items-center justify-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-700 px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:shadow-md cursor-pointer whitespace-nowrap"
          >
            <FiPlus size={16} />
            <span>Add Application</span>
          </button>
        </div>
      </div>

      <SearchFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />

      <JobFilters
        filters={filters}
        setFilters={setFilters}
        onReset={() => setFilters(defaultFilters)}
      />

      <JobStats jobs={filteredJobs} />

      {loading ? (
        <div className="mt-8 text-center text-slate-500 font-medium">
          Loading applications...
        </div>
      ) : (
        <JobsTable
          jobs={filteredJobs}
          onDeleteJob={handleDeleteJob}
          onEditJob={handleEditJob}
          onViewJob={handleViewJob}
          onStatusChange={handleStatusChange}
          onToggleSave={handleToggleSave}
        />
      )}

      <AddJobModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onAddJob={handleSaveJob}
        initialData={editingJob}
      />

      <ViewJobModal
        isOpen={Boolean(viewingJob)}
        job={viewingJob}
        onClose={handleCloseView}
      />
    </div>
  );
}

export default Jobs;