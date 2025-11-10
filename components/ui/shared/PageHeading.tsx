"use client";
import { motion } from "framer-motion";
export default function PageHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="md:flex p-4 md:items-center md:justify-between"
    >
      <div className="min-w-0 flex-1">
        <h2 className="text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          {title}
        </h2>
        {/* Optional explanation/description area */}
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
    </motion.div>
  );
}
