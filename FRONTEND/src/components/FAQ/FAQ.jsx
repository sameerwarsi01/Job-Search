import { useState } from "react";
import { motion } from "framer-motion";
import FAQItem from "./FAQItem";

const faqs = [
  {
    question: "Is Search&Track free to use?",
    answer:
      "Yes! You can start using our free Starter tier anytime. You can also upgrade to Pro for advanced AI matching, ATS resume scoring, and automated daily job alerts.",
  },
  {
    question: "How does the AI Resume Analyzer work?",
    answer:
      "It analyzes your resume against industry benchmarks, identifies missing keywords, and provides actionable suggestions to maximize your shortlisting chances.",
  },
  {
    question: "Can I track interview stages?",
    answer:
      "Yes. You can organize your job pipeline seamlessly across Applied, Interview, Offer, and Rejected stages.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. User authentication is protected with JWT, and sensitive credentials and profile data are securely encrypted in our database.",
  },
  {
    question: "Can I upload multiple resumes?",
    answer:
      "Yes. You can manage and tailor multiple resumes specifically aligned with different target job roles.",
  },
  {
    question: "Does it work on mobile devices?",
    answer:
      "Yes. Search&Track is fully responsive and optimized for seamless use across desktop, tablet, and mobile devices.",
  },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="bg-[#FCFBFF] py-28">
      <div className="mx-auto max-w-4xl px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="font-semibold text-violet-600 uppercase tracking-wider text-sm">
            Frequently Asked Questions
          </p>

          <h2 className="mt-3 text-5xl font-black text-zinc-900">
            Got Questions?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-zinc-500">
            Everything you need to know about Search&Track.
          </p>
        </motion.div>

        {/* FAQ Accordion List */}
        <div className="mt-16 space-y-5">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              isOpen={openIndex === index}
              onClick={() =>
                setOpenIndex(openIndex === index ? null : index)
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQ;