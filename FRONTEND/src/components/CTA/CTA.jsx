import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

function CTA() {
  const navigate = useNavigate();

  const getAuthToken = () => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("userToken") ||
      JSON.parse(localStorage.getItem("user") || "{}")?.token
    );
  };

  const handleGetStarted = () => {
    const token = getAuthToken();
    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/signup");
    }
  };

  const handleLiveDemo = () => {
    const token = getAuthToken();
    if (token) {
      navigate("/jobs");
    } else {
      const featuresElem = document.getElementById("features");
      if (featuresElem) {
        featuresElem.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#FCFBFF] pt-24 pb-36">
      {/* Background Radial Glow */}
      <div className="absolute left-1/2 top-1/2 h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-400/15 blur-[170px]" />

      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-[40px] border border-white/20 bg-gradient-to-br from-[#6D28D9] via-[#7C3AED] to-[#C026D3] px-8 sm:px-12 py-16 sm:py-20 text-center shadow-[0_45px_120px_rgba(124,58,237,.35)]"
        >
          {/* Subtle Ambient Glows */}
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-[120px]" />
          <div className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-pink-400/20 blur-[120px]" />

          {/* Grid Background Pattern */}
          <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:45px_45px]" />

          {/* Feature Badge Icon */}
          <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur-xl">
            <Sparkles size={34} className="text-white" />
          </div>

          {/* Main Headline */}
          <h2 className="relative mt-8 text-4xl sm:text-5xl lg:text-6xl font-black leading-tight text-white">
            Land Your Dream Job
            <br />
            <span className="text-violet-100">Faster with AI</span>
          </h2>

          {/* Descriptive Subtext */}
          <p className="relative mx-auto mt-6 max-w-3xl text-lg sm:text-xl leading-relaxed text-violet-100">
            Search smarter, organize every application, receive AI-powered recommendations, and
            stay ahead throughout your entire job search journey.
          </p>

          {/* CTA Action Buttons */}
          <div className="relative mt-10 flex flex-wrap justify-center gap-4 sm:gap-5">
            <button
              type="button"
              onClick={handleGetStarted}
              className="inline-flex cursor-pointer items-center justify-center rounded-full bg-white px-9 py-3.5 text-base sm:text-lg font-bold text-violet-700 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95"
            >
              Get Started Free
            </button>

            <button
              type="button"
              onClick={handleLiveDemo}
              className="group flex cursor-pointer items-center gap-3 rounded-full border border-white/30 bg-white/10 px-9 py-3.5 text-base sm:text-lg font-semibold text-white backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-white/50 hover:bg-white/20 active:scale-95"
            >
              Live Demo
              <ArrowRight
                size={20}
                className="transition duration-200 group-hover:translate-x-1"
              />
            </button>
          </div>

          {/* Horizontal Divider */}
          <div className="relative mx-auto mt-14 h-px w-full max-w-3xl bg-gradient-to-r from-transparent via-white/30 to-transparent" />

          {/* Metrics & Impact Stats */}
          <div className="relative mt-12 grid grid-cols-1 gap-8 text-white sm:grid-cols-3">
            <div className="flex flex-col items-center">
              <h3 className="text-4xl sm:text-5xl font-black tracking-tight">10K+</h3>
              <p className="mt-2 text-sm sm:text-base font-medium text-violet-100">Active Users</p>
            </div>

            <div className="flex flex-col items-center">
              <h3 className="text-4xl sm:text-5xl font-black tracking-tight">92%</h3>
              <p className="mt-2 text-sm sm:text-base font-medium text-violet-100">Resume Match Accuracy</p>
            </div>

            <div className="flex flex-col items-center">
              <h3 className="text-4xl sm:text-5xl font-black tracking-tight">150K+</h3>
              <p className="mt-2 text-sm sm:text-base font-medium text-violet-100">Applications Tracked</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default CTA;