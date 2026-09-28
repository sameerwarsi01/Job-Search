import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PricingModal from "./pricingModal";

const plans = [
  {
    name: "Starter",
    amount: 0,
    price: "₹0",
    period: "Free Forever",
    desc: "Essential tools to kickstart your structured job search.",
    features: [
      "Track up to 25 applications",
      "Kanban board view",
      "Basic interview alerts",
      "Standard support",
    ],
    highlight: false,
    cta: "Start Free",
  },
  {
    name: "Pro",
    amount: 499,
    price: "₹499",
    period: "month",
    desc: "Accelerate hiring with automated AI recommendations & daily alerts.",
    features: [
      "Unlimited job tracking",
      "AI Resume ATS analyzer",
      "Auto job recommendations",
      "Daily status alerts",
      "Priority support",
    ],
    highlight: true,
    cta: "Get Pro Access",
  },
  {
    name: "Enterprise",
    amount: 999,
    price: "₹999",
    period: "quarter",
    desc: "Complete career acceleration pack for aggressive job seekers.",
    features: [
      "Everything in Pro",
      "AI Cover letter generator",
      "Direct recruiter export (PDF/CSV)",
      "1-on-1 resume review consult",
    ],
    highlight: false,
    cta: "Go Enterprise",
  },
];

function Pricing() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePlanClick = (plan) => {
    const token = localStorage.getItem("token");

    // Starter plan: redirect directly to dashboard or signup
    if (plan.amount === 0) {
      if (!token) {
        navigate("/signup");
      } else {
        navigate("/dashboard");
      }
      return;
    }

    // Pro or Enterprise plans: authenticate first
    if (!token) {
      alert("Please login first to subscribe!");
      navigate("/login");
      return;
    }

    // Open checkout simulation modal
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleUpgradeSuccess = (updatedUser) => {
    console.log("Subscription upgraded successfully", updatedUser);
  };

  return (
    <section id="pricing" className="relative bg-[#FCFBFF] py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Heading */}
        <div className="text-center">
          <p className="font-semibold text-violet-600 uppercase tracking-wider text-sm">
            Plans & Pricing
          </p>
          <h2 className="mt-3 text-5xl font-black text-zinc-900">
            Simple, Transparent Pricing
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-500">
            Choose the plan that fits your career goals. Cancel anytime.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="mt-16 grid gap-8 md:grid-cols-3 items-stretch">
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.25 }}
              className={`relative rounded-3xl bg-white p-8 pb-10 border transition-all duration-300 flex flex-col justify-between ${
                plan.highlight
                  ? "border-violet-500 shadow-2xl shadow-violet-500/15 ring-2 ring-violet-500/20"
                  : "border-zinc-200 shadow-md hover:border-violet-200"
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-4 py-1 text-xs font-bold text-white shadow-md">
                  <Sparkles size={13} /> Most Popular
                </span>
              )}

              <div>
                <h3 className="text-2xl font-bold text-zinc-900">{plan.name}</h3>
                <p className="mt-2 text-sm text-zinc-500 min-h-[44px] leading-relaxed">
                  {plan.desc}
                </p>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-zinc-900">{plan.price}</span>
                  <span className="text-sm font-medium text-zinc-400">/{plan.period}</span>
                </div>

                <ul className="mt-8 space-y-3.5 border-t border-zinc-100 pt-6">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-3 text-sm text-zinc-600">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                        <Check size={12} />
                      </span>
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card Action Button */}
              <div className="pt-8">
                <button
                  type="button"
                  onClick={() => handlePlanClick(plan)}
                  className={`flex items-center justify-center w-full rounded-2xl py-3.5 text-center text-sm font-semibold transition duration-200 cursor-pointer ${
                    plan.highlight
                      ? "bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white shadow-md hover:opacity-95"
                      : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Payment Checkout Modal */}
      {selectedPlan && (
        <PricingModal
          isOpen={isModalOpen}
          plan={selectedPlan}
          onClose={() => setIsModalOpen(false)}
          onUpgradeSuccess={handleUpgradeSuccess}
          onComplete={() => {
            setIsModalOpen(false);
            navigate("/dashboard");
          }}
        />
      )}
    </section>
  );
}

export default Pricing;