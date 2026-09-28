import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X, LayoutDashboard } from "lucide-react";
import logo from "../assets/logo.jpeg";

const navItems = [
  { name: "Home", id: "home" },
  { name: "Features", id: "features" },
  { name: "How it Works", id: "how-it-works" },
  { name: "Pricing", id: "pricing" },
  { name: "About", id: "about" },
];

function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Home");
  const [isAuth, setIsAuth] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("userToken") ||
      JSON.parse(localStorage.getItem("user") || "{}")?.token;

    setIsAuth(Boolean(token));
  }, []);

  const scrollToSection = (id, name) => {
    setActiveTab(name);
    setOpen(false);

    if (id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      const yOffset = -120;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-5 left-1/2 -translate-x-1/2 z-[99] w-full px-4 sm:px-8"
    >
      <nav className="mx-auto flex h-[77px] max-w-[1500px] items-center justify-between rounded-[28px] bg-[#0B0B0D]/95 backdrop-blur-xl border border-white/10 px-6 sm:px-10 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
        {/* Brand Logo & Title */}
        <div 
          onClick={() => scrollToSection("home", "Home")}
          className="flex items-center gap-3 cursor-pointer select-none"
        >
          <img
            src={logo}
            alt="Search & Track"
            className="w-11 h-11 rounded-xl object-cover border border-white/10"
          />

          <h1 className="text-[24px] sm:text-[26px] font-extrabold tracking-tight text-white">
            Search
            <span className="text-violet-500">&</span>
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
              Track
            </span>
          </h1>
        </div>

        {/* Desktop Navigation Links */}
        <ul className="hidden lg:flex items-center gap-10">
          {navItems.map((item) => (
            <li
              key={item.name}
              onClick={() => scrollToSection(item.id, item.name)}
              className={`relative cursor-pointer text-[15px] font-medium transition duration-200 ${
                activeTab === item.name ? "text-white font-semibold" : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {item.name}

              {activeTab === item.name && (
                <motion.span 
                  layoutId="activePill"
                  className="absolute left-1/2 -bottom-3 h-[3px] w-8 -translate-x-1/2 rounded-full bg-violet-500"
                />
              )}
            </li>
          ))}
        </ul>

        {/* Desktop Action Buttons */}
        <div className="hidden lg:flex items-center gap-6">
          {isAuth ? (
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="flex h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-7 font-semibold text-white shadow-lg shadow-violet-500/25 transition duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <LayoutDashboard size={18} />
              Dashboard
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="font-medium text-gray-300 transition hover:text-white"
              >
                Log In
              </Link>

              <Link
                to="/signup"
                className="flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-7 font-semibold text-white shadow-lg shadow-violet-500/25 transition duration-300 hover:scale-105 active:scale-95"
              >
                Sign Up Free
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          aria-label="Toggle navigation menu"
          className="lg:hidden text-white cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {open && (
        <div className="mx-auto mt-3 max-w-[1500px] rounded-3xl bg-[#0B0B0D]/95 backdrop-blur-2xl p-6 shadow-2xl border border-white/10 lg:hidden">
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => scrollToSection(item.id, item.name)}
                className={`text-left text-base py-1 font-medium transition ${
                  activeTab === item.name ? "text-violet-400 font-semibold" : "text-gray-300 hover:text-white"
                }`}
              >
                {item.name}
              </button>
            ))}

            <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
              {isAuth ? (
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    navigate("/dashboard");
                  }}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 py-3 font-semibold text-white shadow-md cursor-pointer"
                >
                  <LayoutDashboard size={18} />
                  Go to Dashboard
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="text-center py-2 text-gray-300 hover:text-white font-medium"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setOpen(false)}
                    className="text-center rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 py-3 font-semibold text-white shadow-md"
                  >
                    Sign Up Free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.header>
  );
}

export default Navbar;