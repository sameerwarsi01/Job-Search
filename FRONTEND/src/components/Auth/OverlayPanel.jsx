import { motion, AnimatePresence } from "framer-motion";

function OverlayPanel({ isSignup, setIsSignup }) {
    return (
        <motion.div
            animate={{
                x: isSignup ? "-100%" : "0%",
                borderRadius: isSignup
                    ? "0px 120px 120px 0px"
                    : "120px 0px 0px 120px",
            }}
            transition={{
                duration: 1,
                ease: [0.65, 0, 0.35, 1],
            }}
            className="absolute top-0 right-0 z-30 h-full w-1/2 overflow-hidden bg-gradient-to-br from-[#6D28D9] via-[#8B5CF6] to-[#2563EB]"
        >

            {/* Background Glow */}

            <div className="absolute left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-[130px]" />

            <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-white/10" />

            <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-blue-300/10" />

            {/* Floating Shapes */}

            <div className="float-one absolute top-16 right-10 h-5 w-5 rotate-45 rounded-sm bg-white/30" />

            <div className="float-two absolute bottom-20 left-10 h-6 w-6 rotate-45 rounded-sm bg-white/20" />

            <div className="rotate-slow absolute left-10 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full border border-white/20" />

            <div className="absolute right-12 top-12 h-16 w-16 rounded-full border border-white/20" />

            <div className="absolute bottom-12 right-1/3 h-20 w-20 rounded-full border border-white/20" />

            <div className="relative z-20 flex h-full flex-col justify-center px-14 py-10">

                <AnimatePresence mode="wait">

                    <motion.div
                        key={isSignup ? "signup" : "login"}
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -25 }}
                        transition={{ duration: .45 }}
                        className="text-center text-white"
                    >

                        <h1 className="text-center text-4xl font-extrabold leading-tight">

                            {isSignup
                                ? "Welcome Back"
                                : "Track Your Dream Career"}

                        </h1>

                        <p className="mt-4 text-base leading-7 text-white/90">

                            {isSignup
                                ? "Sign in and continue managing your applications and interviews."
                                : "Search smarter. Apply faster. Track every opportunity from one AI powered dashboard."}

                        </p>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: .97 }}
                            onClick={() => setIsSignup(!isSignup)}
                            className="mt-6 rounded-full border-2 border-white px-10 py-4 font-semibold transition-all hover:bg-white hover:text-violet-700"
                        >
                            {isSignup ? "Sign In" : "Create Your Account"}
                        </motion.button>

                        {/* Dashboard Cards */}

                        <div className="mt-8 grid gap-4">

                            {/* Resume Score */}

                            <motion.div
                                initial={{ opacity: 0, y: 25 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: .2 }}
                                className="glass rounded-3xl p-5"
                            >

                                <div className="flex items-center justify-between">

                                    <div>

                                        <p className="text-sm text-white/70">
                                            AI Resume Score
                                        </p>

                                        <h2 className="mt-2 text-3xl font-bold">
                                            94%
                                        </h2>

                                    </div>

                                    <div className="rounded-xl bg-white/15 px-4 py-2 text-sm font-semibold">
                                        ATS Ready
                                    </div>

                                </div>

                                <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/20">

                                    <div className="h-full w-[94%] rounded-full bg-white"></div>

                                </div>

                            </motion.div>

                            <div className="grid grid-cols-2 gap-4">
                                                                <motion.div
                                    initial={{ opacity: 0, y: 25 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: .3 }}
                                    className="glass rounded-3xl p-5"
                                >

                                    <p className="text-sm text-white/70">
                                        Applications
                                    </p>

                                    <h2 className="mt-2 text-4xl font-bold">
                                        148
                                    </h2>

                                    <p className="mt-2 text-sm text-green-300">
                                        +18 This Week
                                    </p>

                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 25 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: .4 }}
                                    className="glass rounded-3xl p-5"
                                >

                                    <p className="text-sm text-white/70">
                                        Interviews
                                    </p>

                                    <h2 className="mt-2 text-4xl font-bold">
                                        12
                                    </h2>

                                    <p className="mt-2 text-sm text-blue-200">
                                        3 Scheduled
                                    </p>

                                </motion.div>

                            </div>

                        </div>

                    </motion.div>

                </AnimatePresence>

            </div>

            {/* Floating Glow */}

            <div className="pointer-events-none absolute inset-0">

                <motion.div
                    animate={{
                        y: [0, -15, 0],
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                    }}
                    className="absolute left-8 top-24 h-32 w-32 rounded-full bg-white/5 blur-2xl"
                />

                <motion.div
                    animate={{
                        y: [0, 20, 0],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                    }}
                    className="absolute bottom-16 right-10 h-40 w-40 rounded-full bg-cyan-300/10 blur-3xl"
                />

                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                    }}
                    className="absolute left-1/2 top-10 h-20 w-20 -translate-x-1/2 rounded-full border border-white/20"
                />

            </div>

        </motion.div>
    );
}

export default OverlayPanel;