import { Link } from "react-router-dom";
import { FiEye, FiSearch } from "react-icons/fi";

function RecentApplications({ jobs = [], loading = false, searchQuery = "" }) {
  const badgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case "applied":
        return "bg-amber-100 text-amber-700";
      case "interview":
        return "bg-blue-100 text-blue-700";
      case "offer":
        return "bg-emerald-100 text-emerald-700";
      case "rejected":
        return "bg-rose-100 text-rose-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "Today";
    const parsedDate = new Date(dateValue);
    if (isNaN(parsedDate.getTime())) return "Recently";
    
    return parsedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="mt-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-slate-800">
            Recent Applications
          </h2>
          {searchQuery && (
            <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-700">
              Filtered
            </span>
          )}
        </div>

        <Link
          to="/jobs"
          className="text-sm font-medium text-violet-600 hover:text-violet-700 hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-slate-50 text-left text-sm uppercase tracking-wide text-slate-500">
              <th className="rounded-l-xl px-4 py-4">Company</th>
              <th className="px-4 py-4">Role</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4 whitespace-nowrap">Date</th>
              <th className="rounded-r-xl px-4 py-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400">
                  Loading recent applications...
                </td>
              </tr>
            ) : jobs.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                      <FiSearch size={22} />
                    </div>
                    <p className="text-sm font-semibold text-slate-700">
                      {searchQuery
                        ? `No applications found matching "${searchQuery}"`
                        : "No applications tracked yet."}
                    </p>
                    <p className="text-xs text-slate-400">
                      {searchQuery
                        ? "Try searching for a different company or job title."
                        : "Add your first application to start tracking."}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              jobs.map((app) => {
                const companyName = app.company || app.companyName || "Unknown Company";
                const roleTitle = app.role || app.position || app.title || "Full Stack Developer";
                const initial = companyName.charAt(0).toUpperCase();

                return (
                  <tr
                    key={app._id || app.id}
                    className="border-b transition-all duration-200 hover:bg-violet-50/60 last:border-none"
                  >
                    {/* Company Information */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 font-bold text-white shadow-sm">
                          {initial}
                        </div>
                        <span className="font-semibold text-slate-800">
                          {companyName}
                        </span>
                      </div>
                    </td>

                    {/* Job Position Role */}
                    <td className="px-4 py-4 text-slate-600 font-medium">
                      {roleTitle}
                    </td>

                    {/* Application Status Badge */}
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${badgeColor(
                          app.status
                        )}`}
                      >
                        {app.status || "Applied"}
                      </span>
                    </td>

                    {/* Standardized Application Date */}
                    <td className="px-4 py-4 text-sm text-slate-500 whitespace-nowrap font-medium">
                      {formatDate(app.createdAt || app.appliedAt || app.date)}
                    </td>

                    {/* Direct Inspection Action */}
                    <td className="px-4 py-4 text-center">
                      <Link
                        to="/jobs"
                        className="inline-flex rounded-lg p-2 text-slate-400 hover:bg-violet-100 hover:text-violet-600 transition"
                        title="Manage on Jobs page"
                      >
                        <FiEye size={17} />
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentApplications;