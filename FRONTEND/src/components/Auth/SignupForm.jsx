import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

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

  // Regular Email/Password Signup Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        "https://job-search-xhey.onrender.com/user/signup",
        {
          fullname: {
            firstname: formData.firstname.trim(),
            lastname: formData.lastname.trim(),
          },
          email: formData.email.trim(),
          password: formData.password,
        },
        {
          withCredentials: true,
        }
      );

      alert(response.data.message || "Account Created Successfully!");

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/dashboard");
    } catch (err) {
      const errorMsg =
        err.response?.data?.errors?.[0]?.msg ||
        err.response?.data?.message ||
        "Signup Failed";
      alert(errorMsg);
    }
  };

  // Google OAuth Handler
  const handleGoogleAuth = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        const userData = {
          fullname: {
            firstname: userInfo.data.given_name || userInfo.data.name || "User",
            lastname: userInfo.data.family_name || "",
          },
          email: userInfo.data.email,
          picture: userInfo.data.picture,
        };

        localStorage.setItem("token", tokenResponse.access_token);
        localStorage.setItem("user", JSON.stringify(userData));

        alert(`Welcome, ${userData.fullname.firstname}!`);
        navigate("/dashboard");
        window.location.reload();
      } catch (error) {
        console.error("Google fetching error:", error);
        alert("Failed to fetch Google profile.");
      }
    },
    onError: () => {
      alert("Google Login Failed");
    },
  });

  // GitHub OAuth Login/Signup Handler
  const handleGitHubLogin = () => {
    const GITHUB_CLIENT_ID = "Ov23ligWkeyfg0gTkVaE";
    const redirectUri = window.location.origin + "/login";
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&scope=user:email`;
  };

  return (
    <div
      className={`w-full md:w-1/2 md:absolute md:right-0 md:top-0 h-full flex items-start justify-center bg-white px-4 py-6 sm:px-8 md:px-10 lg:px-14 overflow-y-auto transition-transform duration-700 ${
        isSignup
          ? "flex md:translate-x-0 md:opacity-100"
          : "hidden md:flex md:translate-x-full md:opacity-0"
      }`}
    >
      <div className="w-full max-w-[360px] sm:max-w-md mx-auto my-auto py-2">
        {/* Logo */}
        <div className="mb-4 sm:mb-6 flex items-center justify-center gap-3">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 text-lg sm:text-xl font-bold text-white shadow-lg">
            S
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Search&Track
            </h2>
            <p className="text-[11px] text-slate-500">AI Powered Job Tracker</p>
          </div>
        </div>

        {/* Heading */}
        <h1 className="mb-1 text-center text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Create Account
        </h1>

        <p className="mb-4 text-center text-xs text-slate-500 max-w-xs mx-auto">
          Join thousands of job seekers and manage your career in one place.
        </p>

        {/* Social Buttons */}
        <div className="mb-4 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => handleGoogleAuth()}
            className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm transition hover:bg-slate-50 cursor-pointer"
          >
            <FcGoogle size={20} />
          </button>

          <button
            type="button"
            onClick={handleGitHubLogin}
            className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm transition hover:bg-slate-50 cursor-pointer"
          >
            <FaGithub size={18} className="text-slate-800" />
          </button>
        </div>

        <p className="mb-4 text-center text-xs text-slate-400">
          or create your account with email
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Name Row (Side by side on small screens too) */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div className="relative">
              <FiUser
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
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
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pl-9 pr-2 text-xs sm:text-sm outline-none transition focus:border-violet-600 focus:bg-white focus:ring-2 focus:ring-violet-100"
                required
              />
            </div>

            <div className="relative">
              <FiUser
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
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
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pl-9 pr-2 text-xs sm:text-sm outline-none transition focus:border-violet-600 focus:bg-white focus:ring-2 focus:ring-violet-100"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="relative">
            <FiMail
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
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
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pl-9 pr-3 text-xs sm:text-sm outline-none transition focus:border-violet-600 focus:bg-white focus:ring-2 focus:ring-violet-100"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <FiLock
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
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
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pl-9 pr-9 text-xs sm:text-sm outline-none transition focus:border-violet-600 focus:bg-white focus:ring-2 focus:ring-violet-100"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-violet-600 cursor-pointer"
            >
              {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <FiLock
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
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
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pl-9 pr-9 text-xs sm:text-sm outline-none transition focus:border-violet-600 focus:bg-white focus:ring-2 focus:ring-violet-100"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-violet-600 cursor-pointer"
            >
              {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>

          {/* Terms checkbox */}
          <label className="mt-3 flex cursor-pointer items-start gap-2 text-[11px] sm:text-xs text-slate-500">
            <input
              type="checkbox"
              className="mt-0.5 h-3.5 w-3.5 accent-violet-600 rounded"
              required
            />
            <span>
              I agree to the{" "}
              <span className="font-semibold text-violet-600">Terms of Service</span> and{" "}
              <span className="font-semibold text-violet-600">Privacy Policy</span>.
            </span>
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-violet-600 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white shadow-md shadow-violet-200 hover:bg-violet-700 transition cursor-pointer mt-4"
          >
            <span>Create Account</span>
            <span className="text-base sm:text-lg">→</span>
          </button>
        </form>

        <p className="mt-4 text-center text-[10px] leading-4 text-slate-400">
          Your information is encrypted and securely stored.
        </p>
      </div>
    </div>
  );
}

export default SignupForm;