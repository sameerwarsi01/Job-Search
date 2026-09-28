import { motion } from "framer-motion";
import { Layers } from "lucide-react";

function TestimonialCard({ item, index }) {
  const Icon = item.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="flex h-full flex-col justify-between rounded-3xl border border-violet-100/90 bg-white p-8 shadow-[0_15px_35px_rgba(124,58,237,0.06)] transition-all hover:border-violet-300 hover:shadow-[0_25px_50px_rgba(124,58,237,0.12)]"
    >
      <div>
        <div className="flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
            <Icon size={24} />
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {item.badge}
          </span>
        </div>

        <h3 className="mt-6 text-2xl font-bold text-slate-900">
          {item.title}
        </h3>

        <p className="mt-3.5 text-base leading-relaxed text-slate-500">
          {item.desc}
        </p>
      </div>

      <div className="mt-8 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs font-semibold text-violet-600">
        <Layers size={14} />
        <span>{item.footer}</span>
      </div>
    </motion.div>
  );
}

export default TestimonialCard;