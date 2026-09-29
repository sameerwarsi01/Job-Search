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

  // GitHub Callback Handler (URL se code nikal kar backend bhejna)
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

      console.log("Login Response Data:", response.data);

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
          transition={{ duration: 0.5 }}
          className="mb-8 flex items-center justify-center gap-4"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 text-2xl font-bold text-white shadow-xl">
            S
          </div>

          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Search&Track
            </h2>
            <p className="text-xs text-slate-500">AI Powered Job Tracker</p>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-2 text-center text-[42px] font-extrabold tracking-tight text-slate-900"
        >
          Welcome Back
        </motion.h1>

        <p className="mb-8 text-center leading-7 text-slate-500">
          Track applications, interviews and offers from one beautiful dashboard.
        </p>

        {/* Side-by-side Circular Social Buttons */}
        <div className="mb-5 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => handleGoogleAuth()}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:bg-slate-50 hover:shadow-md"
          >
            <FcGoogle size={24} />
          </button>

          <button
            type="button"
            onClick={handleGitHubLogin}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:bg-slate-50 hover:shadow-md"
          >
            <FaGithub size={22} className="text-slate-800" />
          </button>
        </div>

        <p className="mb-7 text-center text-sm text-slate-400">
          or continue with email
        </p>

        {/* Email & Password Form */}
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
              required
            />
          </div>

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
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-violet-600"
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
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
              type="button"
              className="font-medium text-violet-600 transition hover:text-violet-700 hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          {/* Sign In Button */}
          <motion.button
            type="submit"
            whileHover={{
              scale: 1.03,
              y: -2,
            }}
            whileTap={{
              scale: 0.97,
            }}
            className="primary-btn mt-8 flex items-center justify-center gap-2"
          >
            Sign In
            <span className="text-lg">→</span>
          </motion.button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-xs leading-6 text-slate-400">
          Protected with industry-standard encryption.
          <br />
          Your personal data is always secure.
        </p>
      </div>
    </motion.div>
  );
}

export default LoginForm;