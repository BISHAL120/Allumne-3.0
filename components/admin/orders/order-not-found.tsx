"use client";

import { motion } from "framer-motion";

const OrderNotFound = () => {
  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center px-6">
      <motion.div
        className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.55, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl"
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.65, 0.4] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative w-full max-w-xl rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.45)] p-10 text-center"
      >
        <motion.div
          className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-2xl bg-rose-500/20 border border-rose-400/30"
          animate={{ rotate: [0, -6, 6, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="h-12 w-12 text-rose-300"
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </motion.svg>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="text-3xl md:text-4xl font-black tracking-tight text-white"
        >
          Order Not Found
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-4 text-sm md:text-base text-slate-300 max-w-md mx-auto leading-relaxed"
        >
          We could not locate this order. It may have been removed, or the link
          is incorrect.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="mt-8 h-1.5 w-44 mx-auto rounded-full bg-white/10 overflow-hidden"
        >
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-fuchsia-400 via-rose-400 to-cyan-400"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OrderNotFound;
