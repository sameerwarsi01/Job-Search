import { FiTrendingUp, FiCheckCircle } from "react-icons/fi";

function AIResumeCard({
  score = 84,
  percentile = 78,
  suggestions = [
    "Add more quantified achievements to increase ATS score.",
    "Improve technical keywords for better recruiter matching.",
    "Add one more full-stack project with measurable impact.",
  ],
  onImproveClick,
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">AI Resume Score</h2>
        <div className="rounded-xl bg-violet-50 p-2 text-violet-600">
          <FiTrendingUp size={20} />
        </div>
      </div>

      {/* Progress Bar Header */}
      <div className="flex items-center justify-between text-sm font-medium text-slate-500">
        <span>Resume Strength</span>
        <span className="font-bold text-violet-600">{score}%</span>
      </div>

      {/* Progress Bar */}
      <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-600 to-blue-600 transition-all duration-700"
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Main Score Display */}
      <div className="mt-6">
        <h3 className="text-4xl font-extrabold text-violet-600">{score}%</h3>
        <p className="mt-1 text-sm text-slate-500">
          Your resume is ATS friendly and performs better than{" "}
          <span className="font-semibold text-slate-700">{percentile}%</span> of
          resumes.
        </p>
      </div>

      {/* AI Suggestions */}
      <div className="mt-6 space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          AI Suggestions
        </h4>

        {suggestions.map((suggestion, index) => (
          <div key={index} className="flex items-start gap-2.5 text-xs text-slate-600">
            <FiCheckCircle className="mt-0.5 flex-shrink-0 text-emerald-500" size={14} />
            <span>{suggestion}</span>
          </div>
        ))}
      </div>

      {/* Action Button */}
      <button
        type="button"
        onClick={onImproveClick}
        className="mt-6 w-full rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-violet-700 hover:shadow-lg hover:shadow-violet-200"
      >
        Improve Resume →
      </button>
    </div>
  );
}

export default AIResumeCard;