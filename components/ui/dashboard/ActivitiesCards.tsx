"use client";
import React from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { mockActivities } from "@/data/mockData";
import ActivityCard from "./ActivityCard";

const ActivitiesCards = () => {
  return (
    <>
      <div className="space-y-6">
        {mockActivities.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 text-muted-foreground"
          >
            <p className="text-xl">No activities found. Check back soon! 🚀</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {mockActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ActivityCard activity={activity} onClick={() => {}} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </>
  );
};

export default ActivitiesCards;
