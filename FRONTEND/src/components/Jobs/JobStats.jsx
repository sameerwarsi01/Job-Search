import {
  FiBriefcase,
  FiTrendingUp,
  FiCalendar,
  FiCheckCircle,
} from "react-icons/fi";

function JobStats({ jobs = [] }) {
  const stats = [
    {
      title: "Total",
      value: jobs.length,
      icon: <FiBriefcase size={24} />,
      color: "bg-violet-100 text-violet-600",
    },
    {
      title: "Applied",
      value: jobs.filter(
        (job) => (job.status || "Applied").toLowerCase() === "applied"
      ).length,
      icon: <FiTrendingUp size={24} />,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      title: "Interviews",
      value: jobs.filter(
        (job) => (job.status || "").toLowerCase() === "interview"
      ).length,
      icon: <FiCalendar size={24} />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Offers",
      value: jobs.filter(
        (job) => (job.status || "").toLowerCase() === "offer"
      ).length,
      icon: <FiCheckCircle size={24} />,
      color: "bg-green-100 text-green-600",
    },
  ];

  return (
    <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((card) => (
        <div
          key={card.title}
          className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500">{card.title}</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-800">
                {card.value}
              </h2>
            </div>

            <div className={`rounded-2xl p-4 ${card.color}`}>
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default JobStats;