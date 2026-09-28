import { FiEye, FiEdit2, FiTrash2, FiExternalLink, FiBookmark } from "react-icons/fi";

// Relative time calculation
const formatTimeAgo = (dateValue) => {
  if (!dateValue) return "Recently";
  const date = new Date(dateValue);
  if (isNaN(date.getTime())) return "Recently";

  const diffMs = Date.now() - date.getTime();
  if (diffMs < 0) return "Just now";

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 30) return `${diffDays} days ago`;

  return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
};

function JobsTable({
  jobs = [],
  onDeleteJob,
  onEditJob,
  onViewJob,
  onStatusChange,
  onToggleSave,
}) {
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-rose-100 text-rose-600";
      case "medium":
        return "bg-orange-100 text-orange-600";
      case "low":
        return "bg-emerald-100 text-emerald-600";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const handleApplyClick = (job) => {
    const targetLink =
      job.jobLink ||
      job.url ||
      `https://www.google.com/search?q=${encodeURIComponent(
        `${job.company}${job.role} job careers apply`
      )}`;

    window.open(targetLink, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="mt-6 sm:mt-8 w-full max-w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
      {/* Horizontal scroll container to ensure all actions remain visible and accessible on mobile screens*/}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[850px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <th className="px-5 py-3.5">Company</th>
              <th className="px-5 py-3.5">Role</th>
              <th className="px-5 py-3.5">Location</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Priority</th>
              <th className="px-5 py-3.5">Applied</th>
              <th className="px-5 py-3.5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {jobs.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-12 text-center text-slate-400 font-medium">
                  No jobs found matching your active filters. Try clicking "Reset Filters".
                </td>
              </tr>
            ) : (
              jobs.map((job) => (
                <tr
                  key={job._id || job.id}
                  className="transition-colors hover:bg-slate-50/70"
                >
                  {/* Company Name + Avatar */}
                  <td className="px-5 py-4 font-semibold text-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-600 font-bold text-white shadow-2xs">
                        {job.company?.charAt(0).toUpperCase() || "C"}
                      </div>
                      <span className="whitespace-nowrap">{job.company}</span>
                    </div>
                  </td>

                  {/* Role + WorkMode & Salary Badges */}
                  <td className="px-5 py-4">
                    <div className="font-semibold text-slate-800 leading-snug">{job.role}</div>
                    
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      {job.workMode && (
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold border ${
                            job.workMode.toLowerCase() === "remote"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : job.workMode.toLowerCase() === "hybrid"
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : "bg-slate-100 text-slate-700 border-slate-200"
                          }`}
                        >
                          {job.workMode}
                        </span>
                      )}

                      {job.salary && job.salary !== "Competitive" && (
                        <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 border border-amber-200">
                          {job.salary}
                        </span>
                      )}

                      {job.jobType && (
                        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700 border border-blue-200">
                          {job.jobType}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Location */}
                  <td className="px-5 py-4 text-slate-500 font-medium whitespace-nowrap">
                    {job.location || "-"}
                  </td>

                  {/* Status Dropdown */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <select
                      value={job.status || "Applied"}
                      onChange={(e) =>
                        onStatusChange && onStatusChange(job._id || job.id, e.target.value)
                      }
                      className={`rounded-lg px-2.5 py-1 text-xs font-semibold border border-transparent transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-400 ${
                        job.status === "Interview"
                          ? "bg-amber-100 text-amber-700"
                          : job.status === "Offer"
                          ? "bg-emerald-100 text-emerald-700"
                          : job.status === "Rejected"
                          ? "bg-rose-100 text-rose-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      <option value="Applied">Applied</option>
                      <option value="Interview">Interview</option>
                      <option value="Offer">Offer</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>

                  {/* Priority */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getPriorityColor(
                        job.priority
                      )}`}
                    >
                      {job.priority || "Medium"}
                    </span>
                  </td>

                  {/* Applied Time Ago */}
                  <td className="px-5 py-4 whitespace-nowrap text-xs font-semibold text-slate-600">
                    {formatTimeAgo(job.postedAt || job.createdAt)}
                  </td>

                  {/* Action Buttons */}
                  <td className="px-5 py-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleApplyClick(job)}
                        className="flex items-center gap-1 rounded-lg bg-violet-600 px-2.5 py-1.5 text-xs font-semibold text-white shadow-2xs transition hover:bg-violet-700 cursor-pointer"
                        title="Apply on official portal"
                      >
                        <span>Apply</span>
                        <FiExternalLink size={12} />
                      </button>

                      <button
                        type="button"
                        onClick={() => onToggleSave && onToggleSave(job._id || job.id)}
                        className={`rounded-lg p-1.5 transition cursor-pointer ${
                          job.isSaved
                            ? "bg-violet-100 text-violet-700"
                            : "text-slate-400 hover:bg-violet-50 hover:text-violet-600"
                        }`}
                        title={job.isSaved ? "Remove from Saved" : "Save Job"}
                      >
                        <FiBookmark
                          size={16}
                          className={job.isSaved ? "fill-violet-600 text-violet-600" : ""}
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() => onViewJob && onViewJob(job)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
                        title="View Details"
                      >
                        <FiEye size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => onEditJob && onEditJob(job)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-violet-50 hover:text-violet-600 transition cursor-pointer"
                        title="Edit Application"
                      >
                        <FiEdit2 size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteJob && onDeleteJob(job._id || job.id)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer"
                        title="Delete Application"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default JobsTable;