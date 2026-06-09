"use client";

import { motion } from "framer-motion";
import type { Achievement } from "@/types/achievement";

type AchievementCardProps = {
  achievement: Achievement;
};

export function AchievementCard({ achievement }: AchievementCardProps) {
  return (
    <motion.article
      className="group relative overflow-hidden rounded-card border border-tarnishedGold/70 bg-card-parchment p-card shadow-codex outline outline-1 outline-black/45 transition-colors duration-200 hover:border-antiqueGold/80 hover:shadow-card"
      whileHover={{ y: -3, scale: 1.005 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(216,115,44,0.13),transparent_28%),radial-gradient(circle_at_100%_100%,rgba(202,162,90,0.09),transparent_32%)] opacity-90" />
      <div className="absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-antiqueGold/80 to-transparent" />
      <div className="absolute inset-x-3 bottom-0 h-px bg-gradient-to-r from-transparent via-scorch to-transparent" />
      <div className="relative flex items-start gap-4">
        <div
          aria-hidden="true"
          className="flex size-12 shrink-0 items-center justify-center rounded-badge border-2 border-antiqueGold bg-badge-relic text-2xl font-black text-emberBright shadow-badge ring-2 ring-black/55 transition duration-200 group-hover:scale-105 group-hover:border-emberBright group-hover:text-parchment group-hover:shadow-ember"
        >
          ?
        </div>

        <div className="min-w-0">
          <h2 className="text-xl font-black uppercase leading-tight tracking-title text-parchment drop-shadow-[0_1px_0_rgba(0,0,0,0.75)]">
            {achievement.title}
          </h2>
          <div className="mt-2 h-px w-20 bg-gradient-to-r from-emberBright/70 via-brass/45 to-transparent" />
          <p className="mt-3 text-sm leading-6 text-bone sm:text-base">
            {achievement.description}
          </p>
        </div>
      </div>
    </motion.article>
  );
}
