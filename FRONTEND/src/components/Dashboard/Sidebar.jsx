import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FiHome,
  FiBriefcase,
  FiBookmark,
  FiCalendar,
  FiBarChart2,
  FiUser,
  FiSettings,
  FiLogOut,
  FiX,
} from "react-icons/fi";

const menuItems = [
  {
    icon: <FiHome />,
    label: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: <FiBriefcase />,
    label: "Applications",
    path: "/jobs",
  },
  {
    icon: <FiBookmark />,
    label: "Saved Jobs",
    path: "/saved-jobs",
  },
  {
    icon: <FiCalendar />,
    label: "Interviews",
    path: "/interviews",
  },
  {
    icon: <FiBarChart2 />,
    label: "Analytics",
    path: "/analytics",
  },
  {
    icon: <FiUser />,
    label: "Profile",
    path: "/profile",
  },
  {
    icon: <FiSettings />,
    label: "Settings",
    path: "/settings",
  },
];

function Sidebar({ isOpen = false, onClose = () => {} }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (!confirmLogout) return;

    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("userToken") ||
      JSON.parse(localStorage.getItem("user") || "{}")?.token;

    try {
      if (token) {
        await axios.post(
          "https://job-search-xhey.onrender.com/user/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
      }
    } catch {
      // Silent exit taaki console clean rahe
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("userToken");
      localStorage.removeItem("user");
      sessionStorage.clear();
      navigate("/login", { replace: true });
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs transition-opacity md:hidden"
        />
      )}

      {/* Responsive Sidebar Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-full w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Header & Logo */}
        <div className="flex items-center justify-between border-b border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 text-xl font-bold text-white shadow-sm">
              S
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800">Search&Track</h1>
              <p className="text-[11px] text-slate-500">AI Job Tracker</p>
            </div>
          </div>

          {/* Close button for Mobile View */}
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 md:hidden cursor-pointer"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Menu Navigation Links */}
        <div className="flex-1 px-4 py-5 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              onClick={() => onClose()}
              className={({ isActive }) =>
                `mb-1.5 flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-violet-100 text-violet-700 font-semibold"
                    : "text-slate-600 hover:bg-violet-50 hover:text-violet-600"
                }`
              }
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>

        {/* Logout Action */}
        <div className="mt-auto border-t border-slate-200 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl bg-rose-50 px-4 py-3 text-rose-600 font-semibold text-sm transition hover:bg-rose-100 active:scale-98 cursor-pointer"
          >
            <FiLogOut className="text-lg" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;