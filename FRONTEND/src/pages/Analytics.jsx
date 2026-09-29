import { useState, useEffect } from "react";
import {
  FiTrendingUp,
  FiAward,
  FiCalendar,
  FiBriefcase,
  FiPieChart,
  FiCheckCircle,
  FiXCircle,
  FiClock,
} from "react-icons/fi";

const JOBS_API = "https://job-search-xhey.onrender.com/api/jobs";
const INTERVIEWS_API = "https://job-search-xhey.onrender.com/api/interviews";

function Analytics() {
  const [jobs, setJobs] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        const [jobsRes, interviewsRes] = await Promise.allSettled([
          fetch(JOBS_API),
          fetch(INTERVIEWS_API),
        ]);

        if (jobsRes.status === "fulfilled") {
          const jobsData = await jobsRes.value.json();
          setJobs(Array.isArray(jobsData) ? jobsData : jobsData.jobs || []);
        }

        if (interviewsRes.status === "fulfilled") {
          const intData = await interviewsRes.value.json();
          setInterviews(Array.isArray(intData) ? intData : []);
        }
      } catch (err) {
        console.error("Failed to load analytics data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  // Application Pipeline Counters
  const totalApplications = jobs.length;
  const appliedCount = jobs.filter((j) => (j.status || "Applied").toLowerCase() === "applied").length;
  const interviewCount = jobs.filter((j) => (j.status || "").toLowerCase() === "interview").length;
  const offerCount = jobs.filter((j) => (j.status || "").toLowerCase() === "offer").length;
  const rejectedCount = jobs.filter((j) => (j.status || "").toLowerCase() === "rejected").length;
  const scheduledInterviews = interviews.length;

  // Rate Calculations
  const interviewRate = totalApplications > 0 ? Math.round((interviewCount / totalApplications) * 100) : 0;
  const offerRate = totalApplications > 0 ? Math.round((offerCount / totalApplications) * 100) : 0;

  // Location / Mode Breakdown
  const remoteJobs = jobs.filter(
    (j) =>
      (j.workMode || "").toLowerCase().includes("remote") ||
      (j.location || "").toLowerCase().includes("remote")
  ).length;
  const onSiteJobs = totalApplications - remoteJobs;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-extrabold text-slate-800">Job Search Analytics</h1>
          <span className="rounded-full bg-violet-100 px-3 py-0.5 text-xs font-semibold text-violet-700">
            Real-Time Metrics
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          Monitor your conversion funnel, interview rates, and application outcomes.
        </p>
      </div>

      {loading ? (
        <div className="mt-16 text-center text-slate-400 font-medium">Aggregating job search insights...</div>
      ) : (
        <div className="space-y-8">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Applied</span>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <FiBriefcase size={20} />
                </div>
              </div>
              <div className="mt-3 text-3xl font-extrabold text-slate-800">{totalApplications}</div>
              <p className="mt-1 text-xs text-slate-400">Total job tracker entries</p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Interview Rate</span>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <FiTrendingUp size={20} />
                </div>
              </div>
              <div className="mt-3 text-3xl font-extrabold text-slate-800">{interviewRate}%</div>
              <p className="mt-1 text-xs text-slate-400">{interviewCount} in interview stages</p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Interviews Scheduled</span>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                  <FiCalendar size={20} />
                </div>
              </div>
              <div className="mt-3 text-3xl font-extrabold text-slate-800">{scheduledInterviews}</div>
              <p className="mt-1 text-xs text-slate-400">Active calendar invites</p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Offer Conversion</span>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <FiAward size={20} />
                </div>
              </div>
              <div className="mt-3 text-3xl font-extrabold text-slate-800">{offerCount}</div>
              <p className="mt-1 text-xs text-slate-400">{offerRate}% success conversion</p>
            </div>
          </div>

          {/* Pipeline Funnel & Preferences */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Status Breakdown Bar Chart */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-800">Application Pipeline Funnel</h3>
                <FiPieChart className="text-slate-400" size={18} />
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
                    <span className="flex items-center gap-1.5"><FiClock size={13} className="text-violet-600" /> Applied</span>
                    <span>{appliedCount} ({totalApplications ? Math.round((appliedCount / totalApplications) * 100) : 0}%)</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-violet-600 transition-all duration-500"
                      style={{ width: `${totalApplications ? (appliedCount / totalApplications) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
                    <span className="flex items-center gap-1.5"><FiCalendar size={13} className="text-amber-600" /> Interview</span>
                    <span>{interviewCount} ({interviewRate}%)</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-amber-500 transition-all duration-500"
                      style={{ width: `${interviewRate}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
                    <span className="flex items-center gap-1.5"><FiCheckCircle size={13} className="text-emerald-600" /> Offer</span>
                    <span>{offerCount} ({offerRate}%)</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${offerRate}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
                    <span className="flex items-center gap-1.5"><FiXCircle size={13} className="text-rose-600" /> Rejected</span>
                    <span>{rejectedCount} ({totalApplications ? Math.round((rejectedCount / totalApplications) * 100) : 0}%)</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-rose-500 transition-all duration-500"
                      style={{ width: `${totalApplications ? (rejectedCount / totalApplications) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Distribution Summary */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-slate-800 mb-5">Work Mode Distribution</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 text-center">
                    <p className="text-xs font-semibold text-slate-500">Remote Roles</p>
                    <p className="mt-2 text-2xl font-bold text-violet-700">{remoteJobs}</p>
                    <p className="text-[11px] text-slate-400">
                      {totalApplications ? Math.round((remoteJobs / totalApplications) * 100) : 0}% of portfolio
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 text-center">
                    <p className="text-xs font-semibold text-slate-500">On-site / Hybrid</p>
                    <p className="mt-2 text-2xl font-bold text-indigo-700">{onSiteJobs}</p>
                    <p className="text-[11px] text-slate-400">
                      {totalApplications ? Math.round((onSiteJobs / totalApplications) * 100) : 0}% of portfolio
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-violet-50/70 p-4 border border-violet-100">
                <p className="text-xs font-bold text-violet-800 flex items-center gap-1.5">
                  <FiTrendingUp size={14} /> Pipeline Health
                </p>
                <p className="mt-1 text-xs text-violet-700 leading-relaxed">
                  Focus on keeping your rejection-to-interview turnaround healthy by refining skills matching in your Profile settings.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Analytics;