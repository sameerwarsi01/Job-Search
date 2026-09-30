import ResumeCard from "./ResumeCard";
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
    <div className="relative flex flex-col xl:flex-row items-center justify-center gap-4 lg:gap-6 w-full max-w-5xl mx-auto py-2">
      {/* 1. Main Resume Card */}
      <div className="relative z-10 shrink-0">
        <ResumeCard />
      </div>

      {/* 2. Side Floating Cards (Desktop par side me, Mobile par bottom row me) */}
      <div className="flex flex-row xl:flex-col justify-center items-center gap-4 w-full xl:w-[210px] shrink-0">
        {/* Applications Card */}
        <div
          onClick={() => handleCardClick("/dashboard")}
          className="cursor-pointer rounded-[24px] bg-[#0F1018] p-5 shadow-[0_20px_50px_rgba(0,0,0,.18)] transition-all duration-300 hover:scale-105 active:scale-95 flex-1 xl:flex-none w-full max-w-[210px]"
        >
          <p className="text-xs sm:text-sm text-gray-300">Applications</p>
          <h1 className="mt-2 text-3xl font-bold text-white">24</h1>
          <p className="mt-1 text-xs text-gray-400">Tracked</p>

          <div className="mt-4">
            <svg
              width="120"
              height="40"
              viewBox="0 0 120 45"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full"
            >
              <path
                d="M2 34 L18 20 L34 30 L50 18 L66 28 L82 12 L98 22 L118 5"
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

        {/* Match Score Card */}
        <div
          onClick={() => handleCardClick("/analytics")}
          className="cursor-pointer rounded-[24px] bg-white border border-gray-100 p-4 shadow-[0_20px_50px_rgba(0,0,0,.08)] transition-all duration-300 hover:scale-105 active:scale-95 flex-1 xl:flex-none w-full max-w-[210px] text-center"
        >
          <p className="text-xs text-gray-500">Match Score</p>

          <div className="mt-2 flex justify-center">
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-[8px] border-violet-100">
              <div className="absolute inset-0 rounded-full border-[8px] border-transparent border-t-violet-600 border-r-violet-500 rotate-45"></div>
              <h2 className="text-lg font-bold text-slate-800">92%</h2>
            </div>
          </div>

          <p className="mt-2 text-xs font-semibold text-slate-700">Great Match</p>
          <p className="text-[11px] text-gray-400">Keep going! 🚀</p>
        </div>
      </div>
    </div>
  );
}

export default HeroRight;