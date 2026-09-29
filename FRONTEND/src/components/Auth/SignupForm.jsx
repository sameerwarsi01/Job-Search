import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import {
    FiUser,
    FiMail,
    FiLock,
    FiEye,
    FiEyeOff,
} from "react-icons/fi";

import SocialButton from "./SocialButton";

function SignupForm({ isSignup }) {

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
});

const handleSubmit = async (e) => {
    e.preventDefault();

     console.log("Button Clicked");

    if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    try {
        const response = await axios.post(
            "https://job-search-xhey.onrender.com/user/signup",
            {
                fullname: {
                    firstname: formData.firstname,
                    lastname: formData.lastname,
                },
                email: formData.email,
                password: formData.password,
            },
            {
                withCredentials: true,
            }
        );

        alert(response.data.message);

        localStorage.setItem("token", response.data.token);

        navigate("/dashboard");

    } catch (err) {
        alert(err.response?.data?.message || "Signup Failed");
    }
};

    return (
        <motion.div
            animate={{
                x: isSignup ? "0%" : "100%",
                opacity: isSignup ? 1 : 0,
            }}
            transition={{
                duration: 0.9,
                ease: [0.65, 0, 0.35, 1],
            }}
            className="absolute right-0 top-0 flex h-full w-1/2 items-center justify-center overflow-y-auto bg-white px-14 py-10"
        >

            <div className="w-full max-w-md">

                {/* Logo */}

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: .5 }}
                    className="mb-8 flex items-center justify-center gap-4"
                >

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 text-2xl font-bold text-white shadow-xl">
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
                    Create Account
                </motion.h1>

                <p className="mb-8 text-center leading-7 text-slate-500">
                    Join thousands of job seekers and manage your career in one place.
                </p>

                {/* Social */}

                <div className="mb-6 flex justify-center gap-4">

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
                    or create your account with email
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">

                   {/* First Name */}

              <div className="relative">

             <FiUser
             size={20}
             className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="First Name"
              value={formData.firstname}
              onChange={(e) =>
              setFormData({
             ...formData,
             firstname: e.target.value,
            })
        }
            className="auth-input !pl-14"
   />

        </div>

               {/* Last Name */}

            <div className="relative">

              <FiUser
              size={20}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
               />

             <input
              type="text"
              placeholder="Last Name"
              value={formData.lastname}
              onChange={(e) =>
              setFormData({
              ...formData,
              lastname: e.target.value,
           })
        }
           className="auth-input !pl-14"
    />
          </div>

                    {/* Email */}

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

                    {/* Password Strength */}

                    <div>

                        <div className="mb-2 flex items-center justify-between">

                            <span className="text-xs text-slate-500">
                                Password Strength
                            </span>

                            <span className="text-xs font-semibold text-green-600">
                                Strong
                            </span>

                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-slate-200">

                            <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-violet-600 to-blue-600"></div>

                        </div>

                    </div>

                    {/* Confirm Password */}

                    <div className="relative">

                        <FiLock
                            size={20}
                            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm Password"
                          value={formData.confirmPassword}
                          onChange={(e) =>
                          setFormData({
                          ...formData,
                         confirmPassword: e.target.value,
                   })
           }
                       className="auth-input !pl-14 !pr-14"
       />

                        <button
                            type="button"
                            onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-violet-600"
                        >
                            {showConfirmPassword ? (
                                <FiEyeOff size={20} />
                            ) : (
                                <FiEye size={20} />
                            )}
                        </button>

                    </div>

                {/* Terms */}

                <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm text-slate-500">

                    <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 accent-violet-600"
                    />

                    <span>
                        I agree to the{" "}
                        <span className="font-semibold text-violet-600">
                            Terms of Service
                        </span>{" "}
                        and{" "}
                        <span className="font-semibold text-violet-600">
                            Privacy Policy
                        </span>.
                    </span>

                </label>

                {/* Button */}

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
                    Create Account

                    <span className="text-lg">
                        →
                    </span>

                </motion.button>
                </form>

                {/* Footer */}

                <p className="mt-6 text-center text-xs leading-6 text-slate-400">
                    Your information is encrypted and securely stored.
                </p>

            </div>
        </motion.div>
    );
}

export default SignupForm;