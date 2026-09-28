import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiBell, FiPlus, FiSearch } from "react-icons/fi";
import { Sparkles } from "lucide-react";

function TopNavbar({ searchQuery = "", setSearchQuery, isPro: propIsPro }) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({
    name: "User",
    role: "Software Engineer",
    isPro: false,
  });

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);

        let fullName = "";
        if (parsed.fullname && (parsed.fullname.firstname || parsed.fullname.lastname)) {
          fullName = `${parsed.fullname.firstname || ""} ${parsed.fullname.lastname || ""}`.trim();
        } else {
          fullName = parsed.name || parsed.username || "User";
        }

        const checkPro = Boolean(
          propIsPro ||
          parsed.isPro ||
          parsed.subscriptionPlan === "pro" ||
          parsed.subscriptionPlan === "enterprise"
        );

        setCurrentUser({
          name: fullName,
          role: parsed.role || "Software Engineer",
          isPro: checkPro,
        });
      }
    } catch (err) {
      console.error("Failed to parse user from localStorage:", err);
    }
  }, [propIsPro]);

  const initial = currentUser.name.charAt(0).toUpperCase() || "U";
  const userIsPro = Boolean(propIsPro ?? currentUser.isPro);

  return (
    <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 sm:p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between">
      {/* Search Input Box */}
      <div className="relative w-full sm:w-72 md:w-96">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
        <input
          type="text"
          placeholder="Search jobs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-slate-200 py-2.5 sm:py-3 pl-11 pr-4 text-sm outline-none transition-all duration-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
        />
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-2.5 sm:gap-3.5">
        {/* Add Application Button */}
        <button
          type="button"
          onClick={() => navigate("/jobs")}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-3.5 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md cursor-pointer whitespace-nowrap"
        >
          <FiPlus size={16} />
          <span className="hidden xs:inline sm:inline">Add Application</span>
          <span className="inline xs:hidden sm:hidden">Add</span>
        </button>

        {/* Notification */}
        <button
          type="button"
          aria-label="Notifications"
          className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-slate-50 border border-slate-200/70 p-2 text-slate-600 transition hover:bg-violet-50 hover:text-violet-600 cursor-pointer"
        >
          <FiBell size={18} />
        </button>

        {/* Dynamic User Profile with PRO Badge */}
        <div className="flex items-center gap-2.5 rounded-xl p-1 transition hover:bg-slate-50 cursor-pointer">
          <div className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-blue-600 text-sm font-bold text-white shadow-xs">
            {initial}

            {userIsPro && (
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-400 text-[9px] font-black text-slate-900 ring-2 ring-white">
                ★
              </span>
            )}
          </div>

          <div className="hidden md:block text-left">
            <div className="flex items-center gap-1.5">
              <h3 className="font-semibold text-slate-800 text-xs sm:text-sm leading-tight truncate max-w-[110px]">
                {currentUser.name}
              </h3>

              {userIsPro ? (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-gradient-to-r from-amber-500 to-violet-600 px-1.5 py-0.5 text-[9px] font-extrabold tracking-wider text-white">
                  <Sparkles size={9} /> PRO
                </span>
              ) : (
                <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[9px] font-medium text-slate-500">
                  FREE
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-400 truncate max-w-[120px]">{currentUser.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopNavbar;