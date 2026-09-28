import { motion } from "framer-motion";

function StatCard({
  title,
  value,
  change,
  icon: Icon,
  iconBg,
  iconColor,
}) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.25 }}
      className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-violet-300 hover:shadow-[0_20px_50px_rgba(124,58,237,.15)]"
    >
      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h3 className="mt-3 text-4xl font-black text-slate-900">
            {value}
          </h3>

          <p className="mt-2 text-sm font-semibold text-emerald-500">
            {change}
          </p>
        </div>

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${iconBg}`}
        >
          <Icon className={`h-7 w-7 ${iconColor}`} />
        </div>

      </div>
    </motion.div>
  );
}

export default StatCard;