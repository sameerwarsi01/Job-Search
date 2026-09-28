import { motion } from "framer-motion";
import {
  Briefcase,
  MapPin,
  Clock3,
} from "lucide-react";

function RecentApplications() {
  const jobs = [
    {
      company: "Google",
      role: "Frontend Developer",
      location: "Bangalore",
      status: "Interview",
      color: "bg-blue-100 text-blue-700",
    },
    {
      company: "Amazon",
      role: "MERN Stack Developer",
      location: "Hyderabad",
      status: "Applied",
      color: "bg-violet-100 text-violet-700",
    },
    {
      company: "Microsoft",
      role: "React Developer",
      location: "Noida",
      status: "Offer",
      color: "bg-emerald-100 text-emerald-700",
    },
  ];

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.25 }}
      className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"
    >
      {/* Header */}
      <div className="mb-7 flex items-center justify-between">

        <div>
          <h3 className="text-2xl font-bold text-slate-900">
            Recent Applications
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Track your latest job applications.
          </p>
        </div>

        <div className="rounded-2xl bg-violet-100 p-3">
          <Briefcase className="text-violet-600" size={22} />
        </div>

      </div>

      {/* List */}
      <div className="space-y-5">

        {jobs.map((job) => (
          <div
            key={job.company}
            className="flex items-center justify-between rounded-2xl border border-slate-100 p-4 transition hover:border-violet-300 hover:bg-violet-50/40"
          >
            <div>

              <h4 className="font-bold text-slate-900">
                {job.role}
              </h4>

              <p className="mt-1 text-sm text-slate-500">
                {job.company}
              </p>

              <div className="mt-2 flex items-center gap-4 text-xs text-slate-400">

                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  {job.location}
                </span>

                <span className="flex items-center gap-1">
                  <Clock3 size={14} />
                  2 days ago
                </span>

              </div>

            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${job.color}`}
            >
              {job.status}
            </span>
          </div>
        ))}

      </div>
    </motion.div>
  );
}

export default RecentApplications;