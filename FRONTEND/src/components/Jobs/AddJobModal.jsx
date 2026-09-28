import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";

function AddJobModal({ isOpen, onClose, onAddJob, initialData = null }) {
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    location: "",
    salary: "",
    status: "Applied",
    priority: "Medium",
    appliedDate: "",
    jobLink: "",
    notes: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        company: initialData.company || "",
        role: initialData.role || "",
        location: initialData.location || "",
        salary: initialData.salary || "",
        status: initialData.status || "Applied",
        priority: initialData.priority || "Medium",
        appliedDate: initialData.appliedDate || "",
        jobLink: initialData.jobLink || "",
        notes: initialData.notes || "",
      });
    } else {
      setFormData({
        company: "",
        role: "",
        location: "",
        salary: "",
        status: "Applied",
        priority: "Medium",
        appliedDate: "",
        jobLink: "",
        notes: "",
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formattedDate = formData.appliedDate
      ? new Date(formData.appliedDate).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
        })
      : new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
        });

    const newJob = {
      ...formData,
      salary: formData.salary.trim(),
      date: formattedDate,
    };

    onAddJob(newJob);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">
            {initialData ? "Edit Application" : "Add New Application"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 transition hover:bg-slate-100"
          >
            <FiX size={22} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-5 md:grid-cols-2"
        >
          {/* Company */}
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Company Name"
            required
            className="rounded-xl border border-slate-200 p-3 outline-none focus:border-violet-500"
          />

          {/* Role */}
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            placeholder="Job Role"
            required
            className="rounded-xl border border-slate-200 p-3 outline-none focus:border-violet-500"
          />

          {/* Location */}
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            className="rounded-xl border border-slate-200 p-3 outline-none focus:border-violet-500"
          />

          {/* Salary */}
          <input
            type="text"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            placeholder="Salary (e.g. ₹15 LPA or $90k)"
            className="rounded-xl border border-slate-200 p-3 outline-none focus:border-violet-500"
          />

          {/* Status */}
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="rounded-xl border border-slate-200 p-3 outline-none focus:border-violet-500"
          >
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>

          {/* Priority */}
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="rounded-xl border border-slate-200 p-3 outline-none focus:border-violet-500"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Applied Date */}
          <input
            type="date"
            name="appliedDate"
            value={formData.appliedDate}
            onChange={handleChange}
            className="rounded-xl border border-slate-200 p-3 outline-none focus:border-violet-500"
          />

          {/* Job Link */}
          <input
            type="url"
            name="jobLink"
            value={formData.jobLink}
            onChange={handleChange}
            placeholder="Job Link (Optional)"
            className="rounded-xl border border-slate-200 p-3 outline-none focus:border-violet-500"
          />

          {/* Notes */}
          <textarea
            rows="4"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Notes... (Optional)"
            className="col-span-2 rounded-xl border border-slate-200 p-3 outline-none focus:border-violet-500"
          />

          {/* Buttons */}
          <div className="col-span-2 mt-3 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-6 py-3 font-medium hover:bg-slate-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-3 font-medium text-white hover:shadow-lg"
            >
              {initialData ? "Update Application" : "Save Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddJobModal;