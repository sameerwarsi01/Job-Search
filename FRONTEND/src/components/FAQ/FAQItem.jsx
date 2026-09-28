import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

function FAQItem({ faq, isOpen, onClick }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden transition-colors duration-200">
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center justify-between p-6 text-left cursor-pointer"
      >
        <h3 className="text-lg font-semibold text-zinc-900">
          {faq.question}
        </h3>

        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <Plus className="text-violet-600" size={24} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="px-6 pb-6 leading-7 text-zinc-600">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FAQItem;