import { Link } from "react-router-dom";
import {
  FiCalendar,
  FiClock,
  FiMapPin,
  FiArrowRight,
  FiExternalLink,
} from "react-icons/fi";

function UpcomingInterviews({ jobs = [] }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-slate-800">
            Upcoming Interviews
          </h2>
          <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
            {jobs.length}
          </span>
        </div>

        <Link
          to="/jobs"
          className="text-sm font-medium text-violet-600 hover:text-violet-700 hover:underline"
        >
          View All
        </Link>
      </div>

      {/* List */}
      <div className="space-y-5">
        {jobs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 py-10 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <FiCalendar size={22} />
            </div>
            <p className="font-semibold text-slate-700">No interviews scheduled</p>
            <p className="mt-1 text-sm text-slate-400">
              Update a job status to "Interview" to see it here.
            </p>
          </div>
        ) : (
          jobs.slice(0, 3).map((item) => (
            <div
              key={item._id || item.id}
              className="rounded-2xl border border-slate-200 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-violet-300 hover:shadow-lg"
            >
              {/* Company & Role */}
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-lg font-bold text-white shadow-sm">
                  {item.company?.charAt(0).toUpperCase()}
                </div>

                <div>
                  <h3 className="font-semibold text-slate-800">{item.company}</h3>
                  <p className="text-sm text-slate-500">{item.role}</p>
                </div>
              </div>

              {/* Details */}
              <div className="mt-5 space-y-3 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <FiCalendar className="text-violet-600" />
                  <span>{item.date || "Scheduled Soon"}</span>
                </div>

                <div className="flex items-center gap-2">
                  <FiClock className="text-violet-600" />
                  <span>{item.time || "Time TBD"}</span>
                </div>

                <div className="flex items-center gap-2">
                  <FiMapPin className="text-violet-600" />
                  <span>{item.location || "Online"}</span>
                </div>
              </div>

              {/* Action Button */}
              {item.jobLink ? (
                <a
                  href={item.jobLink.startsWith("http") ? item.jobLink : `https://${item.jobLink}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 py-3 font-medium text-white transition-all duration-300 hover:shadow-lg"
                >
                  Join Meeting / Link
                  <FiExternalLink size={16} />
                </a>
              ) : (
                <Link
                  to="/jobs"
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 py-3 font-medium text-slate-700 transition-all duration-300 hover:bg-violet-50 hover:text-violet-600"
                >
                  View in Jobs
                  <FiArrowRight size={16} />
                </Link>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default UpcomingInterviews;