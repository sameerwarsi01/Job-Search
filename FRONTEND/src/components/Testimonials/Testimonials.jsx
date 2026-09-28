import { motion } from "framer-motion";
import { Target, Zap, ShieldCheck } from "lucide-react";
import TestimonialCard from "./TestimonialCard";

const aboutPillars = [
  {
    id: 1,
    icon: Target,
    badge: "Problem & Solution",
    title: "Centralized Job Workflow",
    desc: "Scattered links and messy spreadsheets lead to missed deadlines. Search&Track synchronizes your entire application pipeline into an intuitive, unified dashboard.",
    footer: "Zero Lost Opportunities",
  },
  {
    id: 2,
    icon: Zap,
    badge: "Smart Relevance",
    title: "AI Match Score Engine",
    desc: "Analyzes uploaded resume credentials against active job requirements to compute real-time match percentages and actionable recommendations.",
    footer: "Intelligent Filtering",
  },
  {
    id: 3,
    icon: ShieldCheck,
    badge: "System Security",
    title: "Enterprise Data Shield",
    desc: "Engineered with JSON Web Token (JWT) authentication, robust middleware guards, and structured database schemas for end-to-end data integrity.",
    footer: "Secure & Encrypted",
  },
];

function Testimonials() {
  return (
    <section id="about" className="relative overflow-hidden bg-[#FCFBFF] py-28">
      {/* Background Soft Glows */}
      <div className="pointer-events-none absolute -left-20 top-20 h-96 w-96 rounded-full bg-violet-200/40 blur-[130px]" />
      <div className="pointer-events-none absolute -right-20 bottom-20 h-96 w-96 rounded-full bg-fuchsia-200/30 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="inline-block rounded-full bg-violet-100 px-5 py-2 text-xs font-bold uppercase tracking-[2px] text-violet-700">
            About The Platform
          </span>

          <h2 className="mt-4 text-4xl font-black text-slate-900 sm:text-5xl">
            Engineered For{" "}
            <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              Serious Job Seekers
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-500 sm:text-lg">
            Search&Track is a high-performance career assistant designed to streamline job tracking, automate resume evaluation, and boost hiring conversion rates.
          </p>
        </motion.div>

        {/* 3 Core Architecture Pillars */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {aboutPillars.map((item, index) => (
            <TestimonialCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;