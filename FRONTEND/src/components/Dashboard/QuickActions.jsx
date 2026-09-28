import { useNavigate } from "react-router-dom";
import {
  FiPlus,
  FiDownload,
  FiUpload,
  FiSettings,
} from "react-icons/fi";

function QuickActions({ jobs = [], onOpenResume }) {
  const navigate = useNavigate();

  const handleExportCSV = () => {
    if (!jobs || jobs.length === 0) {
      alert("No applications found to export.");
      return;
    }

    const headers = ["Company", "Role", "Location", "Salary", "Status", "Priority", "Date"];
    const rows = jobs.map((j) => [
      `"${j.company || ""}"`,
      `"${j.role || ""}"`,
      `"${j.location || ""}"`,
      `"${j.salary || ""}"`,
      `"${j.status || ""}"`,
      `"${j.priority || ""}"`,
      `"${j.date || ""}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `job_applications_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const actions = [
    {
      title: "Add Application",
      subtitle: "Track a new job application",
      icon: <FiPlus size={22} />,
      color: "from-violet-600 to-blue-600",
      onClick: () => navigate("/jobs"),
    },
    {
      title: "Export Applications",
      subtitle: "Download CSV spreadsheet",
      icon: <FiDownload size={22} />,
      color: "from-emerald-500 to-teal-600",
      onClick: handleExportCSV,
    },
    {
      title: "Upload Resume",
      subtitle: "Improve your ATS score",
      icon: <FiUpload size={22} />,
      color: "from-amber-500 to-orange-600",
      onClick: onOpenResume,
    },
    {
      title: "Settings",
      subtitle: "Manage your profile",
      icon: <FiSettings size={22} />,
      color: "from-slate-600 to-slate-800",
      onClick: () => alert("Profile Settings: Under development"),
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl">
      <h2 className="mb-6 text-xl font-bold text-slate-800">Quick Actions</h2>

      <div className="grid gap-4">
        {actions.map((action) => (
          <button
            key={action.title}
            type="button"
            onClick={action.onClick}
            className="group flex w-full items-center gap-4 rounded-2xl border border-slate-200 p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:border-violet-300 hover:shadow-lg"
          >
            <div
              className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r ${action.color} text-white transition-transform duration-300 group-hover:scale-110 shadow-sm`}
            >
              {action.icon}
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-slate-800">{action.title}</h3>
              <p className="mt-1 text-sm text-slate-500 truncate">{action.subtitle}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuickActions;