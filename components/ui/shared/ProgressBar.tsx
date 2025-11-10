import React from "react";

import { motion } from "framer-motion";

interface ProgressBarProps {
  value: number; // 0 - 100
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, className }) => {
  return (
    <div
      className={`w-full h-3 bg-indigo-100 rounded-full overflow-hidden ${
        className || ""
      }`}
    >
      <motion.div
        className="h-full bg-indigo-500"
        initial={{ width: 0 }}
        animate={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        transition={{ type: "spring", stiffness: 240, damping: 20 }}
      />
    </div>
  );
};

export default ProgressBar;
