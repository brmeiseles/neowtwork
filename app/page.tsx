import { AchievementBoard } from "@/components/AchievementBoard";
import { AppShell } from "@/components/AppShell";
import { brandConfig } from "@/config/brand";
import { achievements } from "@/data/achievements";
import { getPublicEnv } from "@/lib/env";

export const dynamic = "force-dynamic";

export default function Home() {
  const publicEnv = getPublicEnv();

  return (
    <AppShell>
      <div className="flex flex-col gap-4 sm:gap-5">
        <header className="codex-hero">
          <div className="mb-3 h-1 w-32 bg-gradient-to-r from-emberBright via-antiqueGold to-transparent shadow-ember" />
          <p className="mb-2 text-[0.7rem] font-black uppercase tracking-ritual text-emberBright drop-shadow-[0_2px_0_rgba(0,0,0,0.8)]">
            {brandConfig.shortName}
          </p>
          <h1 className="max-w-4xl text-4xl font-black uppercase leading-none tracking-title text-parchment drop-shadow-[0_4px_0_rgba(0,0,0,0.8)] sm:text-6xl">
            {brandConfig.boardTitle}
          </h1>
          <p className="mt-3 max-w-2xl text-base font-bold leading-6 text-bone">
            {brandConfig.tagline}
          </p>
        </header>

        <AchievementBoard achievements={achievements} publicEnv={publicEnv} />
      </div>
    </AppShell>
  );
}
