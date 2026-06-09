"use client";

import { motion } from "framer-motion";
import type { Achievement } from "@/types/achievement";

type AchievementCardProps = {
  achievement: Achievement;
};

export function AchievementCard({ achievement }: AchievementCardProps) {
  return (
    <motion.article
      className="group relative overflow-hidden rounded-card border border-brass/25 bg-soot/85 p-card shadow-card transition-colors duration-200 hover:border-ember/70 hover:bg-cardHover"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brass/70 to-transparent" />
      <div className="flex items-start gap-4">
        <div
          aria-hidden="true"
          className="flex size-12 shrink-0 items-center justify-center rounded-badge border-2 border-brass bg-pitch text-2xl font-black text-ember shadow-ember ring-2 ring-black/40 transition duration-200 group-hover:scale-105 group-hover:border-ember group-hover:text-parchment"
        >
          ?
        </div>

        <div className="min-w-0">
          <h2 className="text-xl font-extrabold leading-tight text-parchment">
            {achievement.title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-bone sm:text-base">
            {achievement.description}
          </p>
        </div>
      </div>
    </motion.article>
  );
}
