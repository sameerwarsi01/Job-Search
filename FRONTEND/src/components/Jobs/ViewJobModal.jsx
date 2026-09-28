import { FiX, FiExternalLink, FiCalendar, FiMapPin, FiDollarSign } from "react-icons/fi";

function ViewJobModal({ isOpen, onClose, job }) {
  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl transition-all">
        {/* Top Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-lg font-bold text-white shadow-sm">
              {job.company?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">{job.role}</h3>
              <p className="text-sm font-medium text-slate-500">{job.company}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Info Grid */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <FiMapPin className="text-slate-400" size={18} />
            <div>
              <span className="block text-xs font-semibold text-slate-400 uppercase">Location</span>
              <span className="text-sm font-medium text-slate-700">{job.location || "-"}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <FiDollarSign className="text-slate-400" size={18} />
            <div>
              <span className="block text-xs font-semibold text-slate-400 uppercase">Salary</span>
              <span className="text-sm font-medium text-slate-700">{job.salary || "Not Specified"}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <FiCalendar className="text-slate-400" size={18} />
            <div>
              <span className="block text-xs font-semibold text-slate-400 uppercase">Applied Date</span>
              <span className="text-sm font-medium text-slate-700">{job.date || "Recent"}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <div>
              <span className="block text-xs font-semibold text-slate-400 uppercase">Status & Priority</span>
              <span className="text-sm font-medium text-slate-700">{job.status} • {job.priority}</span>
            </div>
          </div>
        </div>

        {/* Job Link */}
        {job.jobLink && (
          <div className="mt-4">
            <a
              href={job.jobLink.startsWith("http") ? job.jobLink : `https://${job.jobLink}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-violet-600 hover:text-violet-700 transition"
            >
              <span>Open Job Link</span>
              <FiExternalLink size={14} />
            </a>
          </div>
        )}

        {/* Notes */}
        <div className="mt-4">
          <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Notes</label>
          <div className="min-h-[70px] rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-sm text-slate-600">
            {job.notes ? job.notes : "No notes added."}
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewJobModal;