import {
  FileText,
  BrainCircuit,
  BarChart3,
} from "lucide-react";

import StepCard from "./StepCard";

function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: FileText,
      title: "Upload Resume",
      description:
        "Upload your latest resume or build your profile to get started.",
    },
    {
      number: "02",
      icon: BrainCircuit,
      title: "AI Finds Jobs",
      description:
        "Our AI recommends jobs based on your skills and experience.",
    },
    {
      number: "03",
      icon: BarChart3,
      title: "Track Progress",
      description:
        "Monitor applications, interviews and offers from one dashboard.",
    },
  ];

  return (
    <section id="how-it-works" className="relative overflow-hidden bg-[#FCFBFF] py-32">

      {/* Glow */}
      <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-violet-300/20 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-8">

        <div className="text-center">

          <span className="rounded-full bg-violet-100 px-5 py-2 text-sm font-semibold text-violet-700">
            HOW IT WORKS
          </span>

          <h2 className="mt-6 text-5xl font-black text-slate-900">
            Land Your Dream Job
          </h2>

          <h2 className="text-5xl font-black text-violet-600">
            In 3 Easy Steps
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-500">
            Everything you need to organize your job search,
            discover opportunities and track every application.
          </p>

        </div>

        <div className="relative mt-24">

          {/* Timeline */}
          <div className="absolute left-0 right-0 top-8 hidden h-1 rounded-full bg-gradient-to-r from-violet-200 via-violet-500 to-violet-200 lg:block"></div>

          <div className="grid gap-14 lg:grid-cols-3">

            {steps.map((step) => (
              <StepCard
                key={step.number}
                {...step}
              />
            ))}

          </div>

        </div>

      </div>
    </section>
  );
}

export default HowItWorks;