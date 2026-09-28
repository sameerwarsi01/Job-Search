import { useMemo } from "react";
import { FiTarget, FiTrendingUp } from "react-icons/fi";

function WelcomeCard({ jobs = [], userName = "Sameer", monthlyGoal = 50 }) {
  // 1. Dynamic Greeting based on current hour
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }, []);

  // 2. Real metrics derived from jobs data
  const metrics = useMemo(() => {
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);

    // Current week boundary (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    let todayCount = 0;
    let interviewsThisWeek = 0;
    let currentMonthCount = 0;

    jobs.forEach((job) => {
      const dateVal = job.createdAt || job.appliedDate || job.date;
      const jobDate = dateVal ? new Date(dateVal) : null;
      const isValidDate = jobDate && !isNaN(jobDate.getTime());

      // Check today's applications
      if (isValidDate && jobDate.toISOString().slice(0, 10) === todayStr) {
        todayCount += 1;
      }

      // Check interviews this week
      if (job.status?.toLowerCase() === "interview") {
        if (isValidDate && jobDate >= sevenDaysAgo) {
          interviewsThisWeek += 1;
        } else if (!isValidDate) {
          interviewsThisWeek += 1; // fallback if no ISO date
        }
      }

      // Current month applications
      if (
        isValidDate &&
        jobDate.getMonth() === today.getMonth() &&
        jobDate.getFullYear() === today.getFullYear()
      ) {
        currentMonthCount += 1;
      }
    });

    // Fallback: If no ISO dates exist, use total length for month count
    const totalThisMonth = currentMonthCount > 0 ? currentMonthCount : jobs.length;
    const progressPercent = Math.min(
      Math.round((totalThisMonth / monthlyGoal) * 100),
      100
    );
    const remaining = Math.max(monthlyGoal - totalThisMonth, 0);

    return {
      todayCount,
      interviewsThisWeek,
      totalThisMonth,
      progressPercent,
      remaining,
    };
  }, [jobs, monthlyGoal]);

  return (
    <div className="mt-8 rounded-3xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 p-8 text-white shadow-xl transition-all duration-300 hover:shadow-2xl">
      <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
        {/* Left Side */}
        <div>
          <h2 className="text-3xl font-bold">
            👋 {greeting}, {userName}
          </h2>

          <p className="mt-3 max-w-xl text-violet-100 leading-7">
            Welcome back! Keep tracking your applications, interviews and offers
            from one place.
          </p>

          <div className="mt-6 flex flex-wrap gap-4">
            <div className="rounded-xl bg-white/15 px-4 py-2 backdrop-blur-sm">
              <p className="text-sm text-violet-100">Today's Applications</p>
              <h3 className="text-xl font-bold">{metrics.todayCount}</h3>
            </div>

            <div className="rounded-xl bg-white/15 px-4 py-2 backdrop-blur-sm">
              <p className="text-sm text-violet-100">Interviews This Week</p>
              <h3 className="text-xl font-bold">{metrics.interviewsThisWeek}</h3>
            </div>
          </div>
        </div>

        {/* Right Side - Monthly Target */}
        <div className="w-full max-w-sm rounded-2xl bg-white/15 p-6 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <FiTarget />
            <h3 className="font-semibold">Monthly Goal</h3>
          </div>

          <p className="mt-4 text-3xl font-bold">
            {metrics.totalThisMonth} / {monthlyGoal}
          </p>

          <p className="text-sm text-violet-100">Applications Submitted</p>

          {/* Progress Bar */}
          <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-white transition-all duration-700 ease-out"
              style={{ width: `${metrics.progressPercent}%` }}
            />
          </div>

          <div className="mt-4 flex items-center justify-between text-sm">
            <span>{metrics.progressPercent}%</span>

            <span className="flex items-center gap-1">
              <FiTrendingUp />
              {metrics.remaining} Remaining
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomeCard;