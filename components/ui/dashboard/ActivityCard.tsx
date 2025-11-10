import React from "react";
import { motion } from "framer-motion";
import {
  Youtube,
  Music,
  MessageSquare,
  MapPin,
  ShoppingBag,
  Users,
  Eye,
  Award,
} from "lucide-react";
import ProgressBar from "../shared/ProgressBar";

const ActivityCard = ({
  activity,
  onClick,
}: {
  activity: any;
  onClick: () => void;
}) => {
  const getIcon = (type: string) => {
    const icons = {
      youtube: Youtube,
      spotify: Music,
      comment: MessageSquare,
      location: MapPin,
      product: ShoppingBag,
      telegram: Users,
      watch: Eye,
      default: Award,
    };
    const Icon = icons[type as keyof typeof icons] || icons.default;
    return <Icon className="w-6 h-6" />;
  };

  const progress = (activity.capacity_joined / activity.capacity_max) * 100;
  const totalRewardPool =
    parseFloat(activity.reward_amount) * activity.capacity_max;

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="glass-card border-2 border-indigo-500/50 p-6 rounded-2xl cursor-pointer hover:border-primary/50 transition-all space-y-4 flex flex-col justify-between h-full bg-gradient-to-br from-indigo-100 via-white to-white"
    >
      <div>
        <div className="flex items-start justify-between">
          <div className="p-3 bg-primary/20 rounded-xl">
            {getIcon(activity.type)}
          </div>
          {activity.requires_proof && (
            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-semibold">
              Proof
            </span>
          )}
        </div>

        <div className="mt-4">
          <h3 className="font-bold text-lg mb-1 line-clamp-2">
            {activity.title}
          </h3>
          <p className="text-sm text-muted-foreground">
            {activity.advertiser_short}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Total Reward Pool</div>
          <div className="text-2xl font-bold text-primary-accent">
            {totalRewardPool.toLocaleString()} {activity.reward_token}
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Capacity</span>
            <span>
              {activity.capacity_joined}/{activity.capacity_max}
            </span>
          </div>
          <ProgressBar value={progress} className="h-2" />
        </div>
      </div>
    </motion.div>
  );
};

export default ActivityCard;
