import { motion } from "framer-motion";

function SocialButton({ icon, onClick }) {
    return (
        <motion.button
            whileHover={{
                y: -4,
                scale: 1.08,
            }}
            whileTap={{
                scale: 0.95,
            }}
            transition={{
                duration: 0.2,
            }}
            onClick={onClick}
            className="social-btn"
        >
            {icon}
        </motion.button>
    );
}

export default SocialButton;