import { AchievementBoard } from "@/components/AchievementBoard";
import { AppShell } from "@/components/AppShell";
import { brandConfig } from "@/config/brand";
import { achievements } from "@/data/achievements";

export default function Home() {
  return (
    <AppShell>
      <div className="flex flex-col gap-section">
        <header className="border-b border-brass/25 pb-7">
          <div className="mb-4 h-1 w-28 bg-gradient-to-r from-ember via-brass to-transparent shadow-ember" />
          <p className="mb-3 text-xs font-bold uppercase tracking-ritual text-ember">
            {brandConfig.shortName}
          </p>
          <h1 className="max-w-4xl text-4xl font-black uppercase leading-none tracking-wide text-parchment sm:text-6xl">
            {brandConfig.metadataTitle}
          </h1>
          <p className="mt-4 max-w-2xl text-base font-semibold text-bone sm:text-lg">
            {brandConfig.tagline}
          </p>
        </header>

        <AchievementBoard achievements={achievements} />
      </div>
    </AppShell>
  );
}
