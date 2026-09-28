import { useState, useEffect, useMemo } from "react";
import { FiMenu } from "react-icons/fi";

import Sidebar from "../components/Dashboard/Sidebar";
import TopNavbar from "../components/Dashboard/TopNavbar";
import WelcomeCard from "../components/Dashboard/WelcomeCard";
import StatsCards from "../components/Dashboard/StatsCards";
import RecentApplications from "../components/Dashboard/RecentApplications";
import ActivityChart from "../components/Dashboard/ActivityChart";
import UpcomingInterviews from "../components/Dashboard/UpcomingInterviews";
import AIResumeCard from "../components/Dashboard/AIResumeCard";
import RecentActivity from "../components/Dashboard/RecentActivity";
import QuickActions from "../components/Dashboard/QuickActions";
import UploadResumeModal from "../components/Dashboard/UploadResumeModal";

const JOBS_API = "http://localhost:3000/api/jobs";
const INTERVIEWS_API = "http://localhost:3000/api/interviews";
const TOGGLE_ALERT_API = "http://localhost:3000/user/toggle-job-alerts";

function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const isPro = Boolean(
    user?.isPro ||
    user?.subscriptionPlan === "pro" ||
    user?.subscriptionPlan === "enterprise"
  );

  const [jobAlertsEnabled, setJobAlertsEnabled] = useState(() => {
    try {
      const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
      return savedUser.jobAlertsEnabled !== false;
    } catch {
      return true;
    }
  });
  const [toggleLoading, setToggleLoading] = useState(false);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        if (parsed.jobAlertsEnabled !== undefined) {
          setJobAlertsEnabled(parsed.jobAlertsEnabled);
        }
      }
    } catch (e) {
      console.error("Storage parse error:", e);
    }
  }, []);

  const handleToggleAlerts = async () => {
    const nextState = !jobAlertsEnabled;
    setJobAlertsEnabled(nextState);

    try {
      setToggleLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(TOGGLE_ALERT_API, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`Server returned status: ${res.status}`);
      }

      const data = await res.json();
      if (data.success) {
        setJobAlertsEnabled(data.jobAlertsEnabled);
      }

      const existing = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem(
        "user",
        JSON.stringify({ ...existing, jobAlertsEnabled: nextState })
      );
    } catch (err) {
      console.warn("Toggle sync error:", err.message);
      setJobAlertsEnabled(!nextState);
    } finally {
      setToggleLoading(false);
    }
  };

  const displayName =
    user?.fullname?.firstname ||
    user?.name?.split(" ")[0] ||
    user?.username ||
    "User";

  const monthlyGoal = Number(user?.monthlyGoal) || 50;

  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [resumeData, setResumeData] = useState(() => {
    try {
      const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
      if (savedUser.resumeScoreData) {
        return savedUser.resumeScoreData;
      }
      if (savedUser.resumeInfo) {
        const info = savedUser.resumeInfo;
        const currentStream = savedUser.stream || savedUser.category || "Selected Field";
        const readableStream = currentStream
          .replace(/_/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());

        return {
          score: info.score || 78,
          percentile: Math.min(95, Math.max(50, (info.score || 78) - 5)),
          suggestions: info.suggestions && info.suggestions.length > 0
            ? info.suggestions
            : [
                `Profile calibrated for ${readableStream}.`,
                info.skills && info.skills.length > 0
                  ? `Extracted skills: ${info.skills.slice(0, 4).join(", ")}.`
                  : "Upload target-specific resume to refine ATS compatibility.",
                "Live recommendations are calibrated to your domain.",
              ],
        };
      }
    } catch (e) {
      console.error("Error reading saved resume score:", e);
    }

    return {
      score: 75,
      percentile: 70,
      suggestions: [
        "Upload your resume to extract real ATS score & domain skills.",
        "Ensure targeted industry keywords are included in your resume.",
        "Track matching jobs in real time.",
      ],
    };
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [jobsRes, intRes] = await Promise.allSettled([
          fetch(JOBS_API),
          fetch(INTERVIEWS_API),
        ]);

        if (jobsRes.status === "fulfilled") {
          const data = await jobsRes.value.json();
          setJobs(Array.isArray(data) ? data : data.jobs || []);
        }

        if (intRes.status === "fulfilled") {
          const intData = await intRes.value.json();
          setInterviews(Array.isArray(intData) ? intData : []);
        }
      } catch (error) {
        console.error("Error fetching dashboard jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleScoreUpdate = (newData) => {
    setResumeData(newData);
    try {
      const existingUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...existingUser,
          resumeScoreData: newData,
          stream: newData.stream || existingUser.stream,
        })
      );
    } catch (err) {
      console.error("Error persisting resume score to storage:", err);
    }
  };

  const filteredJobs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return jobs;

    return jobs.filter((job) => {
      const company = (job.company || job.companyName || "").toLowerCase();
      const role = (job.role || job.title || job.position || "").toLowerCase();
      const status = (job.status || "").toLowerCase();
      const location = (job.location || "").toLowerCase();

      return (
        company.includes(q) ||
        role.includes(q) ||
        status.includes(q) ||
        location.includes(q)
      );
    });
  }, [jobs, searchQuery]);

  return (
    <div className="flex min-h-screen bg-slate-100 overflow-x-hidden">
      {/* Responsive Drawer Sidebar */}
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        isPro={isPro}
      />

      <main className="flex-1 w-full min-w-0 p-4 sm:p-6 lg:p-8">
        {/* Mobile Header Bar (Only visible on small screens) */}
        <div className="mb-4 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-xs md:hidden">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 font-bold text-white shadow-xs text-sm">
              S
            </div>
            <span className="font-bold text-slate-800 text-base">Search&Track</span>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <FiMenu size={20} />
          </button>
        </div>

        <TopNavbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          userName={displayName}
          isPro={isPro}
        />

        {/* Minimal Clean Job Alert Bar + Pro Badge Indicator */}
        <div className="my-4 sm:my-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white px-4 sm:px-5 py-3 shadow-xs border border-slate-200">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span
              style={{
                backgroundColor: jobAlertsEnabled ? "#10b981" : "#cbd5e1",
              }}
              className="h-2.5 w-2.5 rounded-full inline-block"
            />
            <span className="text-xs font-semibold text-slate-700">
              Daily Job Alerts
            </span>
            <span className="text-[11px] text-slate-400">
              ({jobAlertsEnabled ? "Enabled" : "Disabled"})
            </span>

            {isPro && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-violet-600 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold text-white shadow-2xs">
                ★ PRO MEMBER
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleToggleAlerts}
            disabled={toggleLoading}
            style={{
              backgroundColor: jobAlertsEnabled ? "#4f46e5" : "#e2e8f0",
              width: "44px",
              height: "24px",
            }}
            className="relative inline-flex items-center rounded-full p-0.5 cursor-pointer focus:outline-none transition-colors duration-200"
          >
            <span
              style={{
                transform: jobAlertsEnabled ? "translateX(20px)" : "translateX(2px)",
              }}
              className="inline-block h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-200"
            />
          </button>
        </div>

        <WelcomeCard
          jobs={jobs}
          userName={displayName}
          monthlyGoal={monthlyGoal}
          isPro={isPro}
        />

        <StatsCards jobs={filteredJobs} loading={loading} />

        <div className="mt-6 sm:mt-8 grid grid-cols-1 gap-6 sm:gap-8 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <RecentApplications
              jobs={filteredJobs.slice(0, 5)}
              loading={loading}
              searchQuery={searchQuery}
            />
          </div>
          <ActivityChart jobs={jobs} />
        </div>

        <div className="mt-6 sm:mt-8 grid grid-cols-1 gap-6 sm:gap-8 xl:grid-cols-2">
          <UpcomingInterviews
            interviews={interviews}
            jobs={jobs.filter((j) => j.status?.toLowerCase() === "interview")}
          />
          <AIResumeCard
            score={resumeData.score}
            percentile={resumeData.percentile}
            suggestions={resumeData.suggestions}
            onImproveClick={() => setIsResumeModalOpen(true)}
          />
        </div>

        <div className="mt-6 sm:mt-8 grid grid-cols-1 gap-6 sm:gap-8 xl:grid-cols-2">
          <RecentActivity jobs={jobs} />
          <QuickActions
            jobs={jobs}
            onOpenResume={() => setIsResumeModalOpen(true)}
          />
        </div>
      </main>

      <UploadResumeModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        onScoreUpdate={handleScoreUpdate}
      />
    </div>
  );
}

export default Dashboard;