import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

function FeatureCard({ emoji, title, desc, linkTo }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("userToken") ||
      JSON.parse(localStorage.getItem("user") || "{}")?.token;

    if (token) {
      navigate(linkTo);
    } else {
      navigate("/signup");
    }
  };

  return (
    <motion.div
      whileHover={{ y: -10 }}
      transition={{ duration: 0.25 }}
      onClick={handleCardClick}
      className="
        group
        relative
        cursor-pointer
        overflow-hidden
        rounded-[32px]
        border
        border-violet-100
        bg-white
        p-9
        shadow-[0_10px_40px_rgba(124,92,255,.08)]
        transition-all
        duration-300
        hover:border-violet-300
        hover:shadow-[0_30px_70px_rgba(124,92,255,.18)]
      "
    >
      {/* Background Glow */}
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl opacity-0 transition duration-500 group-hover:opacity-100"></div>

      {/* Icon */}
      <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-100 to-fuchsia-100 text-[42px] transition duration-300 group-hover:scale-110 group-hover:rotate-6">
        {emoji}
      </div>

      {/* Title */}
      <h3 className="mt-8 text-[34px] font-black leading-tight text-[#111827]">
        {title}
      </h3>

      {/* Description */}
      <p className="mt-5 text-[17px] leading-8 text-gray-500">
        {desc}
      </p>

      {/* Button */}
      <button 
        type="button"
        className="mt-10 flex items-center gap-2 font-semibold text-violet-600 transition group-hover:gap-3"
      >
        Learn More
        <ArrowRight size={18} />
      </button>
    </motion.div>
  );
}

export default FeatureCard;