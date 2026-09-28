import { useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DOMAIN_RECOMMENDATIONS = {
  marketing: [
    { company: "HubSpot", role: "Digital Marketing Specialist", match: "94%" },
    { company: "Shopify", role: "SEO & Growth Marketer", match: "90%" },
    { company: "Canva", role: "Content Strategy Lead", match: "87%" },
  ],
  human_resources: [
    { company: "LinkedIn", role: "Technical Recruiter", match: "93%" },
    { company: "Deel", role: "HR Operations Associate", match: "89%" },
    { company: "Stripe", role: "Talent Acquisition Specialist", match: "86%" },
  ],
  design_creative: [
    { company: "Figma", role: "Product Designer (UI/UX)", match: "96%" },
    { company: "Airbnb", role: "Design Systems Specialist", match: "91%" },
    { company: "Adobe", role: "Visual UX Specialist", match: "88%" },
  ],
  data_ai: [
    { company: "Databricks", role: "Data Analyst & BI Specialist", match: "95%" },
    { company: "Snowflake", role: "Data Pipeline Engineer", match: "92%" },
    { company: "OpenAI", role: "Applied AI Evaluation Associate", match: "89%" },
  ],
  sales_business: [
    { company: "Salesforce", role: "Enterprise Account Executive", match: "94%" },
    { company: "Gartner", role: "Business Development Manager", match: "90%" },
    { company: "Notion", role: "Growth Specialist", match: "87%" },
  ],
  software_it: [
    { company: "Google", role: "Frontend Engineer", match: "95%" },
    { company: "Microsoft", role: "React Developer", match: "92%" },
    { company: "Amazon", role: "Full Stack Engineer", match: "89%" },
  ],
};

function AIRecommendations() {
  const navigate = useNavigate();

  const recommendations = useMemo(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const currentCategory = (
        user.stream ||
        user.category ||
        "software_it"
      ).toLowerCase();

      return (
        DOMAIN_RECOMMENDATIONS[currentCategory] ||
        DOMAIN_RECOMMENDATIONS.software_it
      );
    } catch {
      return DOMAIN_RECOMMENDATIONS.software_it;
    }
  }, []);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.25 }}
      className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"
    >
      {/* Header */}
      <div className="mb-7 flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">
            AI Recommendations
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Jobs calibrated directly to your targeted domain skills.
          </p>
        </div>

        <div className="rounded-2xl bg-violet-100 p-3">
          <Sparkles className="text-violet-600" size={22} />
        </div>
      </div>

      {/* Recommendation Cards */}
      <div className="space-y-4">
        {recommendations.map((job) => (
          <div
            key={job.company}
            className="rounded-2xl border border-slate-100 p-5 transition-all duration-300 hover:border-violet-300 hover:bg-violet-50/40"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-bold text-slate-900">
                  {job.role}
                </h4>
                <p className="mt-1 text-sm text-slate-500">{job.company}</p>
              </div>

              <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                {job.match} Match
              </span>
            </div>

            <button
              onClick={() => navigate("/jobs")}
              className="mt-4 flex items-center gap-2 text-sm font-semibold text-violet-600 transition hover:translate-x-1"
            >
              Apply Now
              <ArrowRight size={16} />
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default AIRecommendations;