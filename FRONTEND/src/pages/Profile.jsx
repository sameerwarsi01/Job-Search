import { useState, useEffect } from "react";
import axios from "axios";
import {
  FiUser,
  FiMail,
  FiBriefcase,
  FiLayers,
  FiPlus,
  FiX,
  FiCheck,
  FiSave,
  FiUploadCloud,
  FiFileText,
} from "react-icons/fi";

function Profile() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    targetRole: "",
    category: "software_it",
    skills: [],
    userId: "",
  });

  const [skillInput, setSkillInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Resume Upload States
  const [resumeFile, setResumeFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [resumeData, setResumeData] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUser({
      name: storedUser.name || storedUser.fullname?.firstname || "Software Developer",
      email: storedUser.email || "developer@example.com",
      targetRole: storedUser.targetRole || "Full Stack Developer",
      category: storedUser.stream || storedUser.category || "software_it",
      skills:
        storedUser.skills && storedUser.skills.length > 0
          ? storedUser.skills
          : storedUser.resumeInfo?.skills || ["React", "Node.js", "MongoDB", "Express"],
      userId: storedUser._id || storedUser.id || "",
    });

    if (storedUser.resumeInfo) {
      setResumeData(storedUser.resumeInfo);
    }
  }, []);

  const handleAddSkill = (e) => {
    e.preventDefault();
    const trimmed = skillInput.trim();
    if (trimmed && !user.skills.includes(trimmed)) {
      setUser((prev) => ({
        ...prev,
        skills: [...prev.skills, trimmed],
      }));
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setUser((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  // Resume Upload Handler -> Connects to Express Backend
  const handleResumeUpload = async () => {
    if (!resumeFile) {
      setUploadError("Please select a PDF file first.");
      return;
    }

    setUploading(true);
    setUploadError("");

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("stream", user.category || "software_it");
    if (user.userId) {
      formData.append("userId", user.userId);
    }

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      };

      const res = await axios.post("http://localhost:3000/api/resume/upload", formData, config);

      if (res.data.success) {
        const extracted = res.data.data;
        setResumeData(extracted);

        // Auto-merge newly extracted skills with existing user skills
        const mergedSkills = Array.from(
          new Set([...user.skills, ...(extracted.skills || [])])
        );

        setUser((prev) => ({
          ...prev,
          skills: mergedSkills,
        }));

        // Update local storage cache
        const existing = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...existing,
            stream: extracted.stream,
            resumeInfo: extracted,
            skills: mergedSkills,
          })
        );
      }
    } catch (err) {
      setUploadError(
        err.response?.data?.message || "Failed to process resume. Try again."
      );
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsSaving(true);

    const existing = JSON.parse(localStorage.getItem("user") || "{}");
    const updated = {
      ...existing,
      name: user.name,
      email: user.email,
      targetRole: user.targetRole,
      category: user.category,
      skills: user.skills,
    };

    localStorage.setItem("user", JSON.stringify(updated));

    setTimeout(() => {
      setIsSaving(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }, 400);
  };

  return (
    <div className="mx-auto max-w-4xl p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800">Profile & Preferences</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your career target, primary skills, and auto-matching criteria.
        </p>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* User Info Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-600 text-2xl font-bold text-white shadow-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">{user.name}</h2>
              <p className="text-xs text-slate-400 font-medium">{user.email}</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
                <FiUser className="text-violet-600" /> Full Name
              </label>
              <input
                type="text"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-violet-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
                <FiMail className="text-violet-600" /> Email Address
              </label>
              <input
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-violet-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* AI Resume Upload & Parser Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <FiFileText className="text-violet-600" /> Resume & Skill Extraction
            </h3>
            {resumeData?.fileName && (
              <span className="text-xs font-medium bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
                Active: {resumeData.fileName}
              </span>
            )}
          </div>

          <p className="text-xs text-slate-500">
            Upload your latest resume PDF to automatically extract tech skills and populate matching criteria.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <label className="flex-1 w-full flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 hover:border-violet-400 rounded-xl px-4 py-3 cursor-pointer transition bg-slate-50/50">
              <FiUploadCloud className="text-violet-600" size={18} />
              <span className="text-xs font-medium text-slate-600 truncate">
                {resumeFile ? resumeFile.name : "Choose PDF Resume"}
              </span>
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files[0]) {
                    setResumeFile(e.target.files[0]);
                    setUploadError("");
                  }
                }}
              />
            </label>

            <button
              type="button"
              onClick={handleResumeUpload}
              disabled={uploading || !resumeFile}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 disabled:opacity-50 transition cursor-pointer"
            >
              {uploading ? "Extracting..." : "Upload & Sync"}
            </button>
          </div>

          {uploadError && (
            <p className="text-xs text-rose-500 font-medium">{uploadError}</p>
          )}

          {resumeData?.rawSummary && (
            <div className="mt-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600">
              <span className="font-semibold text-slate-700 block mb-1">Extracted Summary:</span>
              <p className="italic text-slate-500 line-clamp-2 leading-relaxed">{resumeData.rawSummary}</p>
            </div>
          )}
        </div>

        {/* Job Matching Preferences */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-6">
          <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
            <FiBriefcase className="text-violet-600" /> Target Roles & Matching Engine
          </h3>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Primary Target Role
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Full Stack Developer, Frontend Engineer"
                value={user.targetRole}
                onChange={(e) => setUser({ ...user, targetRole: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-violet-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
                <FiLayers className="text-violet-600" /> Domain / Stream
              </label>
              <select
                value={user.category}
                onChange={(e) => setUser({ ...user, category: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-violet-500 focus:outline-none bg-white cursor-pointer"
              >
                <option value="software_it">Software & IT</option>
                <option value="marketing">Marketing</option>
                <option value="finance_accounting">Finance & Accounting</option>
                <option value="human_resources">Human Resources</option>
                <option value="design_creative">Design & Creative</option>
                <option value="sales_business">Sales & Business</option>
                <option value="general">General</option>
              </select>
            </div>
          </div>

          {/* Skills Management */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">
              Core Skills & Tech Stack ({user.skills.length})
            </label>

            <div className="flex flex-wrap gap-2 mb-3.5">
              {user.skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700 border border-violet-100/80 shadow-2xs"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-rose-600 transition cursor-pointer"
                  >
                    <FiX size={14} />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add a new skill (e.g. TypeScript, Docker)..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSkill(e);
                  }
                }}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-violet-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="flex items-center gap-1.5 rounded-xl bg-slate-100 px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition cursor-pointer"
              >
                <FiPlus size={14} /> Add
              </button>
            </div>
          </div>
        </div>

        {/* Polished Bottom Action Footer Bar */}
        <div className="sticky bottom-4 z-10 flex items-center justify-between rounded-2xl border border-slate-200/90 bg-white/95 px-6 py-4 shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-2">
            {savedSuccess ? (
              <span className="flex items-center gap-2 text-xs font-bold text-emerald-600 transition animate-in fade-in">
                <FiCheck size={16} /> Preferences synced & saved successfully!
              </span>
            ) : (
              <span className="text-xs text-slate-500 font-medium">
                Changes immediately calibrate your live job recommendations.
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-violet-700 hover:shadow-lg disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? (
              "Saving..."
            ) : (
              <>
                <FiSave size={16} /> Save Profile
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Profile;