import { motion } from "framer-motion";
import { Upload, PlayCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

function HeroLeft() {
  const navigate = useNavigate();

  const getAuthToken = () => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("userToken") ||
      JSON.parse(localStorage.getItem("user") || "{}")?.token
    );
  };

  // 1. Upload Resume Button: Profile page par bhejega jahan resume upload logic hai
  const handleUploadResumeClick = () => {
    const token = getAuthToken();
    if (token) {
      navigate("/profile");
    } else {
      navigate("/signup");
    }
  };

  // 2. See How It Works Button: Dashboard overview par bhejega
  const handleHowItWorksClick = () => {
    const token = getAuthToken();
    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/signup");
    }
  };

  return (
    <motion.div
      className="w-full max-w-[560px]"
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Badge */}
      <div className="inline-flex items-center rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm font-semibold text-violet-500">
        ✨ AI Powered Job Search
      </div>

      {/* Heading */}
      <h1 className="mt-6 text-[46px] font-extrabold leading-tight tracking-[-1px] text-[#111827] sm:text-[52px] lg:text-[58px]">
        <span className="block">Find Better Jobs.</span>

        <span className="block">
          <span className="bg-gradient-to-r from-violet-600 to-purple-400 bg-clip-text text-transparent">
            Track
          </span>{" "}
          Every Opportunity.
        </span>
      </h1>

      {/* Description */}
      <p className="mt-6 max-w-[520px] text-base leading-8 text-gray-500 sm:text-lg">
        Upload your resume once. Our AI analyzes your skills, searches top job
        portals, matches the best jobs for you, and helps you track every
        application in one smart platform.
      </p>

      {/* Buttons */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <button
          onClick={handleUploadResumeClick}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-500 px-8 py-4 font-semibold text-white transition duration-300 hover:scale-105 active:scale-95"
        >
          <Upload size={20} />
          Upload Resume
        </button>

        <button
          onClick={handleHowItWorksClick}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-black/10 px-8 py-4 font-semibold transition duration-300 hover:scale-105 hover:bg-white/70 active:scale-95 sm:w-auto"
        >
          <PlayCircle size={20} />
          See How It Works
        </button>
      </div>

      {/* Users */}
      <div className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
        <div className="flex -space-x-3">
          <img
            src="https://i.pravatar.cc/50?img=1"
            alt=""
            className="h-12 w-12 rounded-full border-2 border-white"
          />
          <img
            src="https://i.pravatar.cc/50?img=2"
            alt=""
            className="h-12 w-12 rounded-full border-2 border-white"
          />
          <img
            src="https://i.pravatar.cc/50?img=3"
            alt=""
            className="h-12 w-12 rounded-full border-2 border-white"
          />
          <img
            src="https://i.pravatar.cc/50?img=4"
            alt=""
            className="h-12 w-12 rounded-full border-2 border-white"
          />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            10,000+
          </h2>

          <p className="text-gray-500">
            Already finding better opportunities
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default HeroLeft;