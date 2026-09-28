import { useState, useEffect } from "react";
import {
  FiCalendar,
  FiClock,
  FiVideo,
  FiPlus,
  FiTrash2,
  FiUser,
  FiExternalLink,
} from "react-icons/fi";

const API_URL = "http://localhost:3000/api/interviews";

function Interviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const initialFormState = {
    company: "",
    role: "",
    round: "Technical Round 1",
    interviewDate: "",
    meetingLink: "",
    interviewerName: "",
    notes: "",
  };
  const [formData, setFormData] = useState(initialFormState);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      const data = await res.json();
      setInterviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch interviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const handleCreateInterview = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const saved = await res.json();
        setInterviews((prev) => [...prev, saved]);
        setIsModalOpen(false);
        setFormData(initialFormState);
      }
    } catch (err) {
      console.error("Failed to save interview:", err);
    }
  };

  const handleDeleteInterview = async (id) => {
    if (!window.confirm("Delete this interview schedule?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (res.ok) {
        setInterviews((prev) => prev.filter((item) => (item._id || item.id) !== id));
      }
    } catch (err) {
      console.error("Delete interview error:", err);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        setInterviews((prev) =>
          prev.map((item) => ((item._id || item.id) === id ? updated : item))
        );
      }
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  const getRoundBadgeColor = (round) => {
    switch (round) {
      case "HR Round":
        return "bg-sky-100 text-sky-700";
      case "System Design":
        return "bg-purple-100 text-purple-700";
      case "Managerial":
        return "bg-amber-100 text-amber-700";
      case "Final Round":
        return "bg-emerald-100 text-emerald-700";
      default:
        return "bg-violet-100 text-violet-700";
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-8">
      {/* Page Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-slate-800">Interviews</h1>
            <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
              {interviews.length} Scheduled
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Track interview rounds, meeting links, and schedules in one place.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-violet-700 hover:shadow-lg cursor-pointer"
        >
          <FiPlus size={18} /> Schedule Interview
        </button>
      </div>

      {/* Main Grid View */}
      {loading ? (
        <div className="mt-12 text-center text-slate-400 font-medium">
          Loading interview timeline...
        </div>
      ) : interviews.length === 0 ? (
        <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-14 text-center shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
            <FiCalendar size={26} />
          </div>
          <h3 className="mt-4 text-base font-semibold text-slate-800">No interviews scheduled yet</h3>
          <p className="mt-1 text-sm text-slate-500 max-w-sm">
            Keep applying! When recruiters reach out, add their interview rounds and calendar invites here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {interviews.map((item) => {
            const rawDate = item.interviewDate;
            const dateObj = rawDate ? new Date(rawDate) : null;
            const isValidDate = dateObj && !isNaN(dateObj.getTime());

            return (
              <div
                key={item._id || item.id}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-violet-200 hover:shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600 font-bold text-white shadow-sm text-base">
                        {item.company?.charAt(0).toUpperCase() || "I"}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm leading-snug">{item.company}</h4>
                        <p className="text-xs text-slate-500 font-medium">{item.role}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteInterview(item._id || item.id)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer"
                      title="Delete schedule"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>

                  <div className="mt-4 flex items-center gap-2.5">
                    <span
                      className={`inline-block rounded-lg px-2.5 py-1 text-xs font-semibold ${getRoundBadgeColor(
                        item.round
                      )}`}
                    >
                      {item.round}
                    </span>

                    <select
                      value={item.status || "Scheduled"}
                      onChange={(e) =>
                        handleStatusChange(item._id || item.id, e.target.value)
                      }
                      className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 focus:border-violet-500 focus:outline-none cursor-pointer"
                    >
                      <option value="Scheduled">Scheduled</option>
                      <option value="Completed">Completed</option>
                      <option value="Rescheduled">Rescheduled</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Scheduled Details */}
                  <div className="mt-5 space-y-2.5 border-t border-slate-100 pt-4 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <FiCalendar className="text-violet-600" size={15} />
                      <span className="font-semibold text-slate-700">
                        {isValidDate
                          ? dateObj.toLocaleDateString("en-IN", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "Date Pending"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <FiClock className="text-violet-600" size={15} />
                      <span className="font-medium text-slate-600">
                        {isValidDate
                          ? dateObj.toLocaleTimeString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "Time Pending"}
                      </span>
                    </div>

                    {item.interviewerName && (
                      <div className="flex items-center gap-2">
                        <FiUser className="text-violet-600" size={15} />
                        <span className="font-medium text-slate-600">{item.interviewerName}</span>
                      </div>
                    )}
                  </div>

                  {item.notes && (
                    <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/80 p-3 text-xs text-slate-600 italic">
                      "{item.notes}"
                    </div>
                  )}
                </div>

                <div className="mt-6 border-t border-slate-100 pt-4">
                  {item.meetingLink ? (
                    <a
                      href={
                        item.meetingLink.startsWith("http")
                          ? item.meetingLink
                          : `https://${item.meetingLink}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-violet-700 cursor-pointer"
                    >
                      <FiVideo size={14} /> Join Meeting <FiExternalLink size={12} />
                    </a>
                  ) : (
                    <div className="rounded-xl bg-slate-50 py-2.5 text-center text-xs font-medium text-slate-400">
                      No meeting link provided
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Schedule Interview Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl animate-in fade-in zoom-in-95">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Schedule Interview</h2>
            
            <form onSubmit={handleCreateInterview} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Company *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Swiggy"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-violet-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Role *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Frontend Engineer"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-violet-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Round Type</label>
                  <select
                    value={formData.round}
                    onChange={(e) => setFormData({ ...formData, round: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none"
                  >
                    <option value="HR Round">HR Round</option>
                    <option value="Technical Round 1">Technical Round 1</option>
                    <option value="Technical Round 2">Technical Round 2</option>
                    <option value="System Design">System Design</option>
                    <option value="Managerial">Managerial</option>
                    <option value="Final Round">Final Round</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Date & Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.interviewDate}
                    onChange={(e) => setFormData({ ...formData, interviewDate: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Meeting Link (Google Meet / Zoom)</label>
                <input
                  type="text"
                  placeholder="https://meet.google.com/..."
                  value={formData.meetingLink}
                  onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-violet-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Interviewer Name / Title</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe (Tech Lead)"
                  value={formData.interviewerName}
                  onChange={(e) => setFormData({ ...formData, interviewerName: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-violet-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Preparation Notes / Agenda</label>
                <textarea
                  rows="2"
                  placeholder="Topics to revise: DSA, React Hooks, Project Architecture..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-violet-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-violet-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-violet-700 cursor-pointer"
                >
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Interviews;