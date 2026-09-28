import { useState, useEffect } from "react";
import {
  FiTarget,
  FiLock,
  FiTrash2,
  FiCheck,
  FiSave,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

function Settings() {
  const [user, setUser] = useState({
    monthlyGoal: 50,
    emailAlerts: true,
    interviewReminders: true,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState("");

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUser((prev) => ({
      ...prev,
      monthlyGoal: savedUser.monthlyGoal || 50,
    }));
  }, []);

  const handleSavePreferences = (e) => {
    e.preventDefault();
    const existing = JSON.parse(localStorage.getItem("user") || "{}");
    const updated = {
      ...existing,
      monthlyGoal: Number(user.monthlyGoal),
    };
    localStorage.setItem("user", JSON.stringify(updated));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMsg("New passwords do not match!");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordMsg("Password must be at least 6 characters long.");
      return;
    }
    setPasswordMsg("Password updated successfully!");
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setTimeout(() => setPasswordMsg(""), 3000);
  };

  const handleClearCache = () => {
    if (
      window.confirm(
        "Are you sure you want to reset your local dashboard cache?"
      )
    ) {
      sessionStorage.clear();
      alert("Local cache refreshed.");
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-extrabold text-slate-800">Settings</h1>
          <span className="rounded-full bg-slate-100 px-3 py-0.5 text-xs font-semibold text-slate-600">
            Preferences
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          Configure application goals, notification preferences, and account security.
        </p>
      </div>

      <div className="space-y-6">
        {/* 1. Job Hunting Goals */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <h3 className="flex items-center gap-2 border-b border-slate-100 pb-3 font-bold text-slate-800">
            <FiTarget className="text-violet-600" /> Target Goals & Alerts
          </h3>

          <form onSubmit={handleSavePreferences} className="mt-5 space-y-5">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                Monthly Application Target
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="5"
                  max="300"
                  value={user.monthlyGoal}
                  onChange={(e) =>
                    setUser({ ...user, monthlyGoal: e.target.value })
                  }
                  className="w-44 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-800 focus:border-violet-500 focus:outline-none"
                />
                <span className="text-xs font-medium text-slate-500">
                  applications / month
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                Directly updates the target gauge on your Dashboard.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={user.interviewReminders}
                  onChange={(e) =>
                    setUser({ ...user, interviewReminders: e.target.checked })
                  }
                  className="h-4 w-4 rounded accent-violet-600 cursor-pointer"
                />
                <span>Show Upcoming Interview countdown in dashboard</span>
              </label>

              <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={user.emailAlerts}
                  onChange={(e) =>
                    setUser({ ...user, emailAlerts: e.target.checked })
                  }
                  className="h-4 w-4 rounded accent-violet-600 cursor-pointer"
                />
                <span>Daily application streak reminders</span>
              </label>
            </div>

            <div className="flex items-center gap-4 pt-3">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 cursor-pointer"
              >
                <FiSave size={16} /> Save Target
              </button>
              {savedSuccess && (
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 animate-in fade-in">
                  <FiCheck size={16} /> Settings saved!
                </span>
              )}
            </div>
          </form>
        </div>

        {/* 2. Security & Password */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <h3 className="flex items-center gap-2 border-b border-slate-100 pb-3 font-bold text-slate-800">
            <FiLock className="text-violet-600" /> Security & Password
          </h3>

          <form onSubmit={handlePasswordUpdate} className="mt-5 max-w-md space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 pr-10 text-sm focus:border-violet-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showCurrentPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 pr-10 text-sm focus:border-violet-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showNewPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 pr-10 text-sm focus:border-violet-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            {passwordMsg && (
              <p
                className={`text-xs font-bold ${
                  passwordMsg.includes("successfully")
                    ? "text-emerald-600"
                    : "text-rose-500"
                }`}
              >
                {passwordMsg}
              </p>
            )}

            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 cursor-pointer"
            >
              Update Password
            </button>
          </form>
        </div>

        {/* 3. Danger Zone */}
        <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-6 shadow-sm">
          <h3 className="flex items-center gap-2 font-bold text-rose-700">
            <FiTrash2 /> Data & Session Reset
          </h3>
          <p className="mt-1 text-xs text-rose-600">
            Clear locally cached states or reset temporary browser session cookies without deleting jobs.
          </p>

          <button
            type="button"
            onClick={handleClearCache}
            className="mt-4 rounded-xl border border-rose-200 bg-white px-4 py-2 text-xs font-bold text-rose-600 shadow-2xs transition hover:bg-rose-100 cursor-pointer"
          >
            Clear Browser Cache
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;