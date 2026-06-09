import { AchievementBoard } from "@/components/AchievementBoard";
import { AppShell } from "@/components/AppShell";
import { brandConfig } from "@/config/brand";
import { achievements } from "@/data/achievements";

export default function Home() {
  return (
    <AppShell>
      <div className="flex flex-col gap-section">
        <header className="codex-hero">
          <div className="mb-5 h-1.5 w-36 bg-gradient-to-r from-emberBright via-antiqueGold to-transparent shadow-ember" />
          <p className="mb-3 text-xs font-black uppercase tracking-ritual text-emberBright drop-shadow-[0_2px_0_rgba(0,0,0,0.8)]">
            {brandConfig.shortName}
          </p>
          <h1 className="max-w-4xl text-5xl font-black uppercase leading-none tracking-title text-parchment drop-shadow-[0_4px_0_rgba(0,0,0,0.8)] sm:text-7xl">
            {brandConfig.metadataTitle}
          </h1>
          <p className="mt-5 max-w-2xl text-base font-bold text-bone sm:text-lg">
            {brandConfig.tagline}
          </p>
        </header>

        <AchievementBoard achievements={achievements} />
      </div>
    </AppShell>
  );
}
