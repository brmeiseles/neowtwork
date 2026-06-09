import type { Achievement } from "@/types/achievement";

type AchievementCardProps = {
  achievement: Achievement;
};

export function AchievementCard({ achievement }: AchievementCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-lg border border-brass/25 bg-soot/85 p-5 shadow-card transition duration-200 hover:-translate-y-0.5 hover:border-ember/70 hover:bg-[#281b17]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brass/70 to-transparent" />
      <div className="flex items-start gap-4">
        <div
          aria-hidden="true"
          className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-brass bg-pitch text-2xl font-black text-ember shadow-ember ring-2 ring-black/40 transition duration-200 group-hover:scale-105 group-hover:border-ember group-hover:text-parchment"
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
    </article>
  );
}
