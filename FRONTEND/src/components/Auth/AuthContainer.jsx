import { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import OverlayPanel from "./OverlayPanel";
import "../../styles/auth.css";

function AuthContainer() {
  const location = useLocation();
  const [isSignup, setIsSignup] = useState(location.pathname === "/signup");

  return (
    <div className="auth-container relative flex min-h-screen items-center justify-center overflow-x-hidden bg-gradient-to-br from-slate-50 via-violet-50 to-blue-50 px-3 py-6 sm:px-6 lg:px-8">
      {/* Background Blur */}
      <div className="absolute -left-44 -top-44 h-[280px] w-[280px] sm:h-[420px] sm:w-[420px] rounded-full bg-violet-500/20 blur-[100px] sm:blur-[140px] pointer-events-none" />
      <div className="absolute -right-44 -bottom-44 h-[280px] w-[280px] sm:h-[450px] sm:w-[450px] rounded-full bg-blue-500/20 blur-[100px] sm:blur-[150px] pointer-events-none" />
      <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] sm:h-[500px] sm:w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-400/10 blur-[120px] sm:blur-[170px] pointer-events-none" />

      {/* Floating Dots (Desktop only for performance) */}
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="hidden md:block absolute left-16 top-24 h-3 w-3 rounded-full bg-violet-500"
      />
      <motion.div
        animate={{ y: [0, 18, 0] }}
        transition={{ duration: 7, repeat: Infinity }}
        className="hidden md:block absolute right-20 top-36 h-4 w-4 rounded-full bg-blue-500"
      />

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="auth-card relative w-full max-w-md md:max-w-none md:w-[720px] lg:w-[1180px] min-h-[580px] md:h-[720px] lg:h-[800px] overflow-hidden rounded-3xl sm:rounded-[36px] lg:rounded-[42px] border border-white/60 bg-white/95 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur-xl flex flex-col justify-center"
      >
        {/* Mobile Switch Tabs (Mobile par user switch kar sake SignIn / SignUp ke beech) */}
        <div className="flex md:hidden items-center justify-center p-3 pt-5 z-30">
          <div className="flex bg-slate-100 p-1 rounded-2xl w-full max-w-[280px]">
            <button
              type="button"
              onClick={() => setIsSignup(false)}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition ${
                !isSignup ? "bg-white text-violet-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsSignup(true)}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition ${
                isSignup ? "bg-white text-violet-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Forms Container */}
        <div className="relative w-full h-full flex-1">
          <LoginForm isSignup={isSignup} />
          <SignupForm isSignup={isSignup} />

          {/* Desktop Overlay Panel: Mobile par hide rahega taaki form ko cut na kare */}
          <div className="hidden md:block">
            <OverlayPanel isSignup={isSignup} setIsSignup={setIsSignup} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default AuthContainer;