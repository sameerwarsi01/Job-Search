import ResumeCard from "./ResumeCard";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function HeroRight() {
  const navigate = useNavigate();

  const getAuthToken = () => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("userToken") ||
      JSON.parse(localStorage.getItem("user") || "{}")?.token
    );
  };

  const handleCardClick = (destination) => {
    const token = getAuthToken();
    if (token) {
      navigate(destination);
    } else {
      navigate("/signup");
    }
  };

  return (
    <div className="relative flex justify-center lg:justify-start -translate-x-24">
      {/* Main Resume Card */}
      <div className="relative z-20">
        <ResumeCard />
      </div>

      {/* Applications Card */}
      <div
        onClick={() => handleCardClick("/dashboard")}
        className="absolute top-3 right-[-150px] z-30 w-[200px] cursor-pointer rounded-[24px] bg-[#0F1018] p-6 shadow-[0_20px_50px_rgba(0,0,0,.18)] transition-all duration-300 hover:scale-105 hover:shadow-violet-500/10 active:scale-95"
      >
        <p className="text-sm text-gray-300">Applications</p>

        <h1 className="mt-3 text-4xl font-bold text-white">24</h1>

        <p className="mt-2 text-gray-400">Tracked</p>

        {/* Mini Graph */}
        <div className="mt-6">
          <svg
            width="120"
            height="45"
            viewBox="0 0 120 45"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 34
                L18 20
                L34 30
                L50 18
                L66 28
                L82 12
                L98 22
                L118 5"
              stroke="#7C3AED"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />

            <circle cx="2" cy="34" r="2.5" fill="#7C3AED" />
            <circle cx="18" cy="20" r="2.5" fill="#7C3AED" />
            <circle cx="34" cy="30" r="2.5" fill="#7C3AED" />
            <circle cx="50" cy="18" r="2.5" fill="#7C3AED" />
            <circle cx="66" cy="28" r="2.5" fill="#7C3AED" />
            <circle cx="82" cy="12" r="2.5" fill="#7C3AED" />
            <circle cx="98" cy="22" r="2.5" fill="#7C3AED" />
            <circle cx="118" cy="5" r="2.5" fill="#7C3AED" />
          </svg>
        </div>
      </div>

      {/* Match Score */}
      <div
        onClick={() => handleCardClick("/analytics")}
        className="absolute bottom-3 right-[-150px] z-30 w-[200px] cursor-pointer rounded-[24px] bg-white border border-gray-100 p-5 shadow-[0_20px_50px_rgba(0,0,0,.08)] transition-all duration-300 hover:scale-105 active:scale-95"
      >
        <p className="text-sm text-gray-500">Match Score</p>

        <div className="mt-3 flex justify-center">
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-[10px] border-violet-200">
            <div className="absolute inset-0 rounded-full border-[10px] border-transparent border-t-violet-600 border-r-violet-500 rotate-45"></div>

            <div className="text-center">
              <h2 className="text-2xl font-bold">92%</h2>
            </div>
          </div>
        </div>

        <p className="mt-3 text-center font-medium">Great Match</p>

        <p className="mt-2 text-center text-sm text-gray-500">
          Keep going! 🚀
        </p>
      </div>
    </div>
  );
}

export default HeroRight;