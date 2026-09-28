import { CheckCircle2 } from "lucide-react";
import JobCard from "./JobCard";
import MatchCircle from "./MatchCircle";
import { useNavigate } from "react-router-dom";

function ResumeCard() {
  const navigate = useNavigate();

  const getAuthToken = () => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("userToken") ||
      JSON.parse(localStorage.getItem("user") || "{}")?.token
    );
  };

  const handleSmartNavigate = (targetPath) => {
    const token = getAuthToken();
    if (token) {
      navigate(targetPath);
    } else {
      navigate("/signup");
    }
  };

  return (
    <div className="w-[560px] rounded-[30px] border border-[#ECEAF6] bg-white px-8 py-7 shadow-[0_25px_70px_rgba(0,0,0,.08)]">
      {/* Top Header */}
      <div className="flex items-start justify-between">
        <div>
          <div
            onClick={() => handleSmartNavigate("/profile")}
            className="group flex cursor-pointer items-center gap-3 transition"
          >
            <CheckCircle2
              size={26}
              className="text-violet-600 drop-shadow-[0_0_8px_rgba(139,92,246,0.4)] transition group-hover:scale-110"
            />

            <div>
              <h2 className="text-[30px] font-bold leading-none text-gray-900 group-hover:text-violet-700 transition">
                Resume Uploaded
              </h2>

              <p className="mt-3 text-[18px] text-gray-500">
                Frontend Developer
              </p>
            </div>
          </div>
        </div>

        <MatchCircle />
      </div>

      {/* Jobs Section */}
      <div className="mt-7">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">
            Top Matched Jobs For You
          </h3>

          <button
            onClick={() => handleSmartNavigate("/jobs")}
            className="cursor-pointer font-semibold text-violet-600 transition hover:text-violet-800 hover:underline active:scale-95"
          >
            View all →
          </button>
        </div>

        <div className="space-y-1">
          <JobCard
            logo="/logos/amazon.png"
            company="Amazon"
            role="Frontend Developer"
            location="Bangalore"
            match="95% Match"
          />

          <JobCard
            logo="/logos/microsoft.png"
            company="Microsoft"
            role="Software Engineer"
            location="Hyderabad"
            match="91% Match"
          />

          <JobCard
            logo="/logos/Google-Logo.Wine.png"
            company="Google"
            role="Frontend Developer"
            location="Remote"
            match="88% Match"
          />
        </div>
      </div>
    </div>
  );
}

export default ResumeCard;