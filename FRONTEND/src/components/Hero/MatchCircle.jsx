import { motion } from "framer-motion";

function MatchCircle() {
  return (
    <div className="relative flex h-28 w-28 items-center justify-center">

      {/* Background Circle */}
      <svg className="absolute w-32 h-32 -rotate-90">

            <circle
                cx="64"
                cy="64"
                r="54"
                stroke="#E5E7EB"
                strokeWidth="8"
                fill="none"
            />

            <motion.circle
                cx="64"
                cy="64"
                r="54"
                stroke="#7C3AED"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="339"
                initial={{ strokeDashoffset: 339 }}
                animate={{ strokeDashoffset: 28 }}
                transition={{
                duration: 1.8,
                ease: "easeOut",
                }}
            />

        </svg>
      {/* Text */}

      <div className="text-center">

        <h2 className="text-[30px] font-bold leading-none text-[#111827]">
          92%
        </h2>

        <p className="mt-1 text-sm font-medium text-gray-500">
          Overall Match
        </p>

      </div>

    </div>
  );
}

export default MatchCircle;