import FeatureCard from "./FeatureCard";

function Features() {
  return (
    <section id="features" className="relative bg-[#FCFBFF] py-32 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[450px] w-[450px] rounded-full bg-violet-500/10 blur-[180px]" />

      <div className="relative mx-auto max-w-[1400px] px-8">
        {/* Heading */}
        <div className="text-center">
          <span className="inline-block rounded-full bg-violet-100 px-6 py-2 text-sm font-bold uppercase tracking-[2px] text-violet-700">
            Features
          </span>

          <h2 className="mt-7 text-[58px] font-black leading-tight text-[#111827]">
            Everything You Need
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-8 text-gray-500">
            Manage your entire job search from one beautiful dashboard.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-24 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            emoji="📄"
            title="Resume Manager"
            desc="Upload and organize all your resumes."
            linkTo="/profile"
          />

          <FeatureCard
            emoji="🎯"
            title="Job Tracking"
            desc="Track every application in one place."
            linkTo="/dashboard"
          />

          <FeatureCard
            emoji="📅"
            title="Interview Planner"
            desc="Never miss an interview again."
            linkTo="/interviews"
          />

          <FeatureCard
            emoji="📊"
            title="Analytics"
            desc="See your job search progress."
            linkTo="/analytics"
          />

          <FeatureCard
            emoji="🤖"
            title="AI Matching"
            desc="AI recommends the best jobs."
            linkTo="/jobs"
          />

          <FeatureCard
            emoji="🚀"
            title="Career Growth"
            desc="Improve your hiring chances."
            linkTo="/jobs"
          />
        </div>
      </div>
    </section>
  );
}

export default Features;