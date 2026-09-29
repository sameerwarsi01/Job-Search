import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FiLock, FiMail, FiEye, FiEyeOff } from "react-icons/fi";
import SocialButton from "./SocialButton";

function LoginForm({ isSignup }) {

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
    email: "",
    password: "",
});

const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await axios.post(
            "https://job-search-xhey.onrender.com/user/login",
            {
                email: formData.email,
                password: formData.password,
            },
            {
                withCredentials: true,
            }
        );

        console.log("Login Response Data:", response.data);

        // Token save karo
        if (response.data.token) {
            localStorage.setItem("token", response.data.token);
        }

        // User object dynamically save karo (jo backend se return ho raha hai)
        const loggedInUser = response.data.user || {
            name: response.data.name || response.data.username || formData.email.split("@")[0],
            email: formData.email,
            role: response.data.role || "Software Engineer",
        };

        localStorage.setItem("user", JSON.stringify(loggedInUser));

        alert("Login Successful");

        navigate("/dashboard");

    } catch (err) {
        console.log(err);
        alert(err.response?.data?.message || "Login Failed");
    }
};

    return (
        <motion.div
            animate={{
                x: isSignup ? "-100%" : "0%",
                opacity: isSignup ? 0 : 1,
            }}
            transition={{
                duration: 0.9,
                ease: [0.65, 0, 0.35, 1],
            }}
            className="absolute left-0 top-0 flex h-full w-1/2 items-center justify-center bg-white px-14"
        >

            <div className="w-full max-w-md">

                {/* Logo */}

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: .5 }}
                    className="mb-8 flex items-center justify-center gap-4"
                >

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 text-2xl font-bold text-white shadow-xl">
                        S
                    </div>

                    <div>

                        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
                            Search&Track
                        </h2>

                        <p className="text-xs text-slate-500">
                            AI Powered Job Tracker
                        </p>

                    </div>

                </motion.div>

                {/* Heading */}

                <motion.h1
                    initial={{ opacity: 0, y: -15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: .1 }}
                    className="mb-2 text-center text-[42px] font-extrabold tracking-tight text-slate-900"
                >
                    Welcome Back
                </motion.h1>

                <p className="mb-8 text-center leading-7 text-slate-500">
                    Track applications, interviews and offers from one beautiful dashboard.
                </p>

                {/* Social */}

                <div className="mb-5 flex items-center justify-center gap-3">

                    <SocialButton
                        icon={<FcGoogle size={24} />}
                    />

                    <SocialButton
                        icon={
                            <FaGithub
                                size={22}
                                className="text-slate-800"
                            />
                        }
                    />

                </div>

                <p className="mb-7 text-center text-sm text-slate-400">
                    or continue with email
                </p>

                {/* Email */}

                <form onSubmit={handleSubmit} className="space-y-6">

                    <div className="relative">

                        <FiMail
                            size={20}
                            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          type="email"
                          placeholder="Email Address"
                          value={formData.email}
                          onChange={(e) =>
                         setFormData({
                        ...formData,
                       email: e.target.value,
                     })
              }
           className="auth-input !pl-14"
       />

                    </div>
                                        {/* Password */}

                    <div className="relative">

                        <FiLock
                            size={20}
                            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={formData.password}
                            onChange={(e) =>
                            setFormData({
                            ...formData,
                           password: e.target.value,
                        })
                   }
                 className="auth-input !pl-14 !pr-14"
            />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-violet-600"
                        >
                            {showPassword ? (
                                <FiEyeOff size={20} />
                            ) : (
                                <FiEye size={20} />
                            )}
                        </button>

                    </div>

                {/* Remember Me */}

                <div className="mt-6 flex items-center justify-between text-sm">

                    <label className="flex cursor-pointer items-center gap-2 text-slate-500">

                        <input
                            type="checkbox"
                            className="h-4 w-4 accent-violet-600"
                        />

                        Remember me

                    </label>

                    <button
                        className="font-medium text-violet-600 transition hover:text-violet-700 hover:underline"
                    >
                        Forgot Password?
                    </button>

                </div>

                {/* Sign In */}

                <motion.button
                    type="submit"
                    whileHover={{
                        scale: 1.03,
                        y: -2,
                    }}
                    whileTap={{
                        scale: .97,
                    }}
                    className="primary-btn mt-8 flex items-center justify-center gap-2"
                >
                    Sign In

                    <span className="text-lg">
                        →
                    </span>

                </motion.button>
                </form>

                {/* Footer */}

                <p className="mt-6 text-center text-xs leading-6 text-slate-400">
                    Protected with industry-standard encryption.<br />
                    Your personal data is always secure.
                </p>

            </div>

        </motion.div>
    );
}

export default LoginForm;