import { useNavigate } from "react-router-dom";

function JobCard({ logo, company, role, location, match }) {
  const navigate = useNavigate();

  const handleApplyClick = () => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("userToken") ||
      JSON.parse(localStorage.getItem("user") || "{}")?.token;

    if (token) {
      navigate("/jobs");
    } else {
      navigate("/signup");
    }
  };

  return (
    <div className="flex items-center justify-between rounded-2xl border border-transparent px-3 py-4 transition-all duration-300 hover:border-violet-100 hover:bg-violet-50/40">
      {/* Left */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {/* Company Logo */}
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white border border-gray-200 shadow-sm">
          <img
            src={logo}
            alt={company}
            className="w-9 h-9 object-contain"
          />
        </div>

        <div className="min-w-0">
          <h2 className="truncate text-[17px] font-bold text-[#111827]">
            {role}
          </h2>

          <p className="mt-1 text-sm text-gray-500 truncate">
            {company} • {location}
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="ml-5 flex items-center gap-3 shrink-0">
        <span className="whitespace-nowrap rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
          {match}
        </span>

        <button
          onClick={handleApplyClick}
          className="cursor-pointer rounded-xl bg-[#111827] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-black active:scale-95"
        >
          Apply
        </button>
      </div>
    </div>
  );
}

export default JobCard;