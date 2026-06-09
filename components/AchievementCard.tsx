"use client";

import { motion } from "framer-motion";
import { LockKeyhole } from "lucide-react";
import type { Achievement } from "@/types/achievement";

type AchievementCardProps = {
  achievement: Achievement;
};

export function AchievementCard({ achievement }: AchievementCardProps) {
  return (
    <motion.article
      className="achievement-card group"
      whileHover={{ y: -5, scale: 1.012 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <div className="relative z-10 flex items-start gap-5">
        <div
          aria-hidden="true"
          className="locked-emblem transition duration-200 group-hover:scale-110 group-hover:text-parchment"
        >
          <LockKeyhole className="size-7 drop-shadow-[0_2px_0_rgba(0,0,0,0.8)]" />
        </div>

        <div className="min-w-0">
          <h2 className="achievement-title text-xl font-black uppercase leading-tight tracking-title sm:text-2xl">
            {achievement.title}
          </h2>
          <div className="mt-2 h-0.5 w-28 bg-gradient-to-r from-emberBright via-antiqueGold/70 to-transparent shadow-ember" />
          <p className="mt-3 text-sm font-medium leading-6 text-bone sm:text-base">
            {achievement.description}
          </p>
        </div>
      </div>
    </motion.article>
  );
}
