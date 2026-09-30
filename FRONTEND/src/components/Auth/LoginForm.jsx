import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FiLock, FiMail, FiEye, FiEyeOff } from "react-icons/fi";
import { useGoogleLogin } from "@react-oauth/google";

function LoginForm({ isSignup }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // GitHub Callback Handler
  useEffect(() => {
    const code = searchParams.get("code");

    if (code) {
      const exchangeGitHubCode = async () => {
        try {
          const response = await axios.post(
            "https://job-search-xhey.onrender.com/user/github-login",
            { code },
            { withCredentials: true }
          );

          if (response.data.token) {
            localStorage.setItem("token", response.data.token);
          }

          localStorage.setItem("user", JSON.stringify(response.data.user));

          alert("GitHub Login Successful!");
          navigate("/dashboard");
          window.location.reload();
        } catch (err) {
          console.error("GitHub exchange error:", err);
          alert(err.response?.data?.message || "GitHub authentication failed");
        }
      };

      exchangeGitHubCode();
    }
  }, [searchParams, navigate]);

  // Standard Email/Password Login
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

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      const backendUser = response.data.user || {};
      const loggedInUser = {
        ...backendUser,
        fullname: backendUser.fullname || {
          firstname: response.data.name || formData.email.split("@")[0],
          lastname: "",
        },
        email: backendUser.email || formData.email,
      };

      localStorage.setItem("user", JSON.stringify(loggedInUser));

      alert("Login Successful");
      navigate("/dashboard");
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Login Failed");
    }
  };

  // Google OAuth Login Handler
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
        console.error("Google login error:", error);
        alert("Failed to fetch Google profile.");
      }
    },
    onError: () => {
      alert("Google Login Failed");
    },
  });

  // GitHub OAuth Login Handler
  const handleGitHubLogin = () => {
    const GITHUB_CLIENT_ID = "Ov23ligWkeyfg0gTkVaE";
    const redirectUri = window.location.origin + "/login";
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&scope=user:email`;
  };

  // Mobile par agar user Signup state me hai toh login form screen se hide rahega
  if (typeof window !== "undefined" && window.innerWidth < 768 && isSignup) {
    return null;
  }

  return (
    <div
      className={`w-full md:w-1/2 md:absolute md:left-0 md:top-0 min-h-screen md:min-h-full flex items-center justify-center bg-white px-4 py-8 sm:px-8 md:px-10 lg:px-12 z-10 transition-transform duration-700 ${
        isSignup ? "hidden md:flex md:-translate-x-full md:opacity-0" : "flex md:translate-x-0 md:opacity-100"
      }`}
    >
      <div className="w-full max-w-[360px] sm:max-w-sm mx-auto flex flex-col justify-center">
        {/* Logo */}
        <div className="mb-5 sm:mb-6 flex items-center justify-center gap-3">
          <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 text-lg font-bold text-white shadow-md">
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
          Welcome Back
        </h1>

        <p className="mb-5 text-center text-xs text-slate-500 max-w-xs mx-auto">
          Track applications, interviews and offers from one dashboard.
        </p>

        {/* Social Buttons */}
        <div className="mb-4 flex items-center justify-center gap-3">
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
          or continue with email
        </p>

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
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
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pl-10 pr-3 text-xs sm:text-sm outline-none transition focus:border-violet-600 focus:bg-white focus:ring-2 focus:ring-violet-100"
              required
            />
          </div>

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
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pl-10 pr-10 text-xs sm:text-sm outline-none transition focus:border-violet-600 focus:bg-white focus:ring-2 focus:ring-violet-100"
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

          {/* Remember Me */}
          <div className="flex items-center justify-between text-xs pt-0.5">
            <label className="flex cursor-pointer items-center gap-1.5 text-slate-500">
              <input
                type="checkbox"
                className="h-3.5 w-3.5 accent-violet-600 rounded"
              />
              Remember me
            </label>
            <button
              type="button"
              className="font-medium text-violet-600 hover:text-violet-700 hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-violet-600 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-violet-200 hover:bg-violet-700 transition cursor-pointer mt-4"
          >
            <span>Sign In</span>
            <span>→</span>
          </button>
        </form>

        {/* Footer */}
        <p className="mt-5 text-center text-[10px] leading-4 text-slate-400">
          Protected with industry-standard encryption.
          <br />
          Your personal data is always secure.
        </p>
      </div>
    </div>
  );
}

export default LoginForm;