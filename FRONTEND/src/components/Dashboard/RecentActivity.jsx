import { Link } from "react-router-dom";
import {
  FiBriefcase,
  FiCalendar,
  FiCheckCircle,
  FiXCircle,
  FiClock,
} from "react-icons/fi";

function RecentActivity({ jobs = [] }) {
  const getActivityMeta = (job) => {
    switch (job.status?.toLowerCase()) {
      case "interview":
        return {
          title: `Interview with ${job.company}`,
          subtitle: `${job.role} • ${job.location || "Remote"}`,
          icon: <FiCalendar size={18} />,
          color: "bg-blue-100 text-blue-600",
        };
      case "offer":
        return {
          title: `Offer from ${job.company}!`,
          subtitle: `${job.role} • ${job.salary || "Package confirmed"}`,
          icon: <FiCheckCircle size={18} />,
          color: "bg-emerald-100 text-emerald-600",
        };
      case "rejected":
        return {
          title: `Application closed at ${job.company}`,
          subtitle: `${job.role}`,
          icon: <FiXCircle size={18} />,
          color: "bg-rose-100 text-rose-600",
        };
      case "applied":
      default:
        return {
          title: `Applied to ${job.company}`,
          subtitle: `${job.role} • ${job.salary || "Application Sent"}`,
          icon: <FiBriefcase size={18} />,
          color: "bg-violet-100 text-violet-600",
        };
    }
  };

  const recentList = jobs.slice(0, 4);

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">Recent Activity</h2>

        <Link
          to="/jobs"
          className="text-sm font-medium text-violet-600 hover:text-violet-700 hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="space-y-4">
        {recentList.length === 0 ? (
          <div className="py-8 text-center text-slate-400">
            <FiClock className="mx-auto mb-2 text-slate-300" size={24} />
            No recent activity recorded yet.
          </div>
        ) : (
          recentList.map((job, index) => {
            const meta = getActivityMeta(job);

            return (
              <div
                key={job._id || job.id || index}
                className="relative flex gap-4 rounded-xl p-3 transition-all duration-200 hover:bg-slate-50"
              >
                {index !== recentList.length - 1 && (
                  <div className="absolute left-[26px] top-12 h-9 w-0.5 bg-slate-200" />
                )}

                <div
                  className={`z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${meta.color} shadow-sm`}
                >
                  {meta.icon}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="truncate text-sm font-semibold text-slate-800">
                      {meta.title}
                    </h3>
                    <span className="ml-2 whitespace-nowrap text-xs text-slate-400">
                      {job.date || "Recent"}
                    </span>
                  </div>

                  <p className="mt-0.5 truncate text-xs text-slate-500">
                    {meta.subtitle}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default RecentActivity;