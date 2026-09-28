import { motion } from "framer-motion";

function StepCard({ number, icon: Icon, title, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -8 }}
      className="group relative text-center"
    >
      {/* Step Number */}
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-4 border-violet-100 bg-white shadow-lg transition-all duration-300 group-hover:border-violet-500">
        <span className="text-lg font-bold text-violet-600">
          {number}
        </span>
      </div>

      {/* Icon */}
      <div className="mx-auto mt-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-xl">
        <Icon size={34} />
      </div>

      <h3 className="mt-6 text-2xl font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-4 leading-7 text-slate-500">
        {description}
      </p>
    </motion.div>
  );
}

export default StepCard;