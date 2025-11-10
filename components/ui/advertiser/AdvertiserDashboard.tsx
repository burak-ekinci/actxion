"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Users,
  CheckCircle,
  Clock,
  Plus,
  FileText,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/shared/Button";
import Link from "next/link";

const AdvertiserDashboard = () => {
  // TODO: Add logic to check if user has AdvertiserPass NFT
  const hasAdvertiserPass = false; // Temporary - replace with actual NFT check

  const kpis = [
    {
      label: "Active Campaigns",
      value: "3",
      icon: BarChart3,
      color: "text-blue-400",
    },
    {
      label: "Total Participants",
      value: "247",
      icon: Users,
      color: "text-green-400",
    },
    {
      label: "Approved Proofs",
      value: "189",
      icon: CheckCircle,
      color: "text-primary-accent",
    },
    {
      label: "Pending Review",
      value: "12",
      icon: Clock,
      color: "text-yellow-400",
    },
  ];

  const shortcuts = [
    {
      label: "Create Campaign",
      icon: Plus,
      to: "/advertiser/wizard",
      color: "bg-blue-100", // Soft blue
    },
    {
      label: "View Campaigns",
      icon: FileText,
      to: "/advertiser/campaigns",
      color: "bg-emerald-100", // Soft green
    },
    {
      label: "Review Submissions",
      icon: CheckCircle,
      to: "/advertiser/submissions",
      color: "bg-pink-100", // Soft pink
    },
    {
      label: "Manage Payouts",
      icon: DollarSign,
      to: "/advertiser/payouts",
      color: "bg-yellow-100", // Soft yellow
    },
  ];

  if (hasAdvertiserPass) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Users className="w-16 h-16 text-muted-foreground" />
        <p className="text-xl text-muted-foreground text-center">
          You need an AdvertiserPass NFT to access this area.
        </p>
        <Link href="/mint#advertiserpass">
          <Button className="neon-glow">Get AdvertiserPass</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, index) => {
            const Icon = kpi.icon;
            return (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 rounded-2xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <Icon className={`w-8 h-8 ${kpi.color}`} />
                </div>
                <div className="text-3xl font-bold mb-1">{kpi.value}</div>
                <div className="text-sm text-muted-foreground">{kpi.label}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6 rounded-2xl"
        >
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {shortcuts.map((shortcut) => {
              const Icon = shortcut.icon;
              return (
                <Link key={shortcut.label} href={shortcut.to}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`${shortcut.color} p-6 rounded-xl text-center cursor-pointer hover:opacity-90 transition-opacity`}
                  >
                    <Icon className="w-8 h-8 mx-auto mb-3" />
                    <p className="font-semibold">{shortcut.label}</p>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* AI Approval Rate */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6 rounded-2xl"
        >
          <h2 className="text-2xl font-bold mb-4">AI Approval Rate</h2>
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-secondary rounded-full h-4 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "87%" }}
                transition={{ duration: 1, delay: 0.6 }}
                className="bg-linear-to-r from-green-400 to-primary h-full"
              />
            </div>
            <span className="text-2xl font-bold text-green-400">87%</span>
          </div>
        </motion.div> */}
      </div>
    </>
  );
};
export default AdvertiserDashboard;
