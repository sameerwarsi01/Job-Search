import {
  FiBriefcase,
  FiCalendar,
  FiCheckCircle,
  FiTrendingUp,
  FiXCircle,
} from "react-icons/fi";

function StatsCards({ jobs = [], loading = false }) {
  // Database jobs se real counts calculate karna
  const totalApplications = jobs.length;
  const interviewCount = jobs.filter(
    (job) => job.status?.toLowerCase() === "interview"
  ).length;
  const offerCount = jobs.filter(
    (job) => job.status?.toLowerCase() === "offer"
  ).length;
  const rejectedCount = jobs.filter(
    (job) => job.status?.toLowerCase() === "rejected"
  ).length;

  const stats = [
    {
      title: "Applications",
      value: totalApplications,
      trend: "Total tracked",
      icon: <FiBriefcase size={24} />,
      color: "bg-violet-100 text-violet-600",
    },
    {
      title: "Interviews",
      value: interviewCount,
      trend: "In pipeline",
      icon: <FiCalendar size={24} />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Offers",
      value: offerCount,
      trend: "Secured",
      icon: <FiCheckCircle size={24} />,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Rejected",
      value: rejectedCount,
      trend: "Reviewed",
      icon: <FiXCircle size={24} />,
      color: "bg-red-100 text-red-600",
    },
  ];

  return (
    <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((card) => (
        <div
          key={card.title}
          className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">{card.title}</p>

              <h2 className="mt-2 text-4xl font-bold text-slate-800">
                {loading ? (
                  <span className="inline-block h-9 w-12 animate-pulse rounded-lg bg-slate-200" />
                ) : (
                  card.value
                )}
              </h2>

              <div className="mt-4 flex items-center gap-2 text-sm font-medium text-green-600">
                <FiTrendingUp size={16} />
                {card.trend}
              </div>
            </div>

            <div
              className={`rounded-2xl p-4 transition-transform duration-300 group-hover:scale-110 ${card.color}`}
            >
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatsCards;