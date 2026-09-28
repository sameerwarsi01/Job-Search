import { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import OverlayPanel from "./OverlayPanel";
import "../../styles/auth.css";

function AuthContainer() {

    const location = useLocation();

const [isSignup, setIsSignup] = useState(
    location.pathname === "/signup"
);
    return (
        <div className="auth-container relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-violet-50 to-blue-50 px-6 py-10">

            {/* Background Blur */}

            <div className="absolute -left-44 -top-44 h-[420px] w-[420px] rounded-full bg-violet-500/20 blur-[140px] float-one"></div>

            <div className="absolute -right-44 -bottom-44 h-[450px] w-[450px] rounded-full bg-blue-500/20 blur-[150px] float-two"></div>

            <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-400/10 blur-[170px]"></div>

            {/* Floating Dots */}

            <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute left-16 top-24 h-3 w-3 rounded-full bg-violet-500"
            />

            <motion.div
                animate={{ y: [0, 18, 0] }}
                transition={{ duration: 7, repeat: Infinity }}
                className="absolute right-20 top-36 h-4 w-4 rounded-full bg-blue-500"
            />

            <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 6, repeat: Infinity }}
                className="absolute bottom-24 left-24 h-5 w-5 rounded-full bg-pink-400"
            />

            <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute bottom-16 right-24 h-3 w-3 rounded-full bg-violet-400"
            />

            {/* Decorative Rings */}

            <div className="rotate-slow absolute left-10 top-1/3 h-28 w-28 rounded-full border border-violet-300/30"></div>

            <div className="rotate-slow absolute right-16 bottom-1/4 h-20 w-20 rounded-full border border-blue-300/30"></div>

            {/* Main Card */}

            <motion.div
                initial={{ opacity: 0, scale: .96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: .6 }}
                className="auth-card relative h-[800px] w-[1180px] overflow-hidden rounded-[42px] border border-white/40 bg-white/90 shadow-[0_35px_80px_rgba(0,0,0,0.15)] backdrop-blur-xl"
            >

                <LoginForm
                    isSignup={isSignup}
                />

                <SignupForm
                    isSignup={isSignup}
                />

                <OverlayPanel
                    isSignup={isSignup}
                    setIsSignup={setIsSignup}
                />

            </motion.div>

        </div>
    );
}

export default AuthContainer;