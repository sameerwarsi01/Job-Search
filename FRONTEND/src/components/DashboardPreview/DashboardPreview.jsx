import { motion } from "framer-motion";
import {
  Briefcase,
  CalendarDays,
  BadgeCheck,
  FileText,
  ArrowRight,
  LayoutDashboard,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import StatCard from "./StatCard";
import RecentApplications from "./RecentApplications";
import AIRecommendations from "./AIRecommendations";

function DashboardPreview() {
  const navigate = useNavigate();

  const handleDashboardRedirect = () => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("userToken") ||
      JSON.parse(localStorage.getItem("user") || "{}")?.token;

    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/signup");
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#FCFBFF] py-32">
      {/* Background Glow */}
      <div className="absolute left-1/2 top-20 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-violet-300/20 blur-[160px]" />

      <div className="relative mx-auto max-w-7xl px-8">
        {/* Heading */}
        <div className="text-center">
          <span className="rounded-full bg-violet-100 px-5 py-2 text-sm font-semibold text-violet-700">
            DASHBOARD
          </span>

          <h2 className="mt-6 text-5xl font-black text-slate-900">
            Everything You Need
          </h2>

          <h2 className="text-5xl font-black text-violet-600">
            In One Dashboard
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-500">
            Organize your applications, monitor interviews,
            and receive AI-powered job recommendations.
          </p>

          {/* Direct CTA Button */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleDashboardRedirect}
              className="group inline-flex cursor-pointer items-center gap-3 rounded-full bg-slate-900 px-7 py-3.5 text-base font-semibold text-white shadow-xl shadow-slate-900/10 transition-all duration-300 hover:scale-105 hover:bg-violet-600 active:scale-95"
            >
              <LayoutDashboard size={19} />
              Open Live Dashboard
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>

        {/* Dashboard Preview Card */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-16 rounded-[40px] border border-slate-200 bg-white/80 p-8 shadow-[0_40px_120px_rgba(124,58,237,.12)] backdrop-blur-xl"
        >
          {/* Stats */}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Applications"
              value="128"
              change="+18% this week"
              icon={Briefcase}
              iconBg="bg-violet-100"
              iconColor="text-violet-600"
            />

            <StatCard
              title="Interviews"
              value="24"
              change="+6 scheduled"
              icon={CalendarDays}
              iconBg="bg-sky-100"
              iconColor="text-sky-600"
            />

            <StatCard
              title="Offers"
              value="8"
              change="+2 this month"
              icon={BadgeCheck}
              iconBg="bg-emerald-100"
              iconColor="text-emerald-600"
            />

            <StatCard
              title="Resume Score"
              value="92%"
              change="Excellent"
              icon={FileText}
              iconBg="bg-orange-100"
              iconColor="text-orange-600"
            />
          </div>

          {/* Bottom Grid */}
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <RecentApplications />
            <AIRecommendations />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default DashboardPreview;