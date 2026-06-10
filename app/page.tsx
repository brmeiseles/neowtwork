import { AchievementBoard } from "@/components/AchievementBoard";
import { AppHero } from "@/components/AppHero";
import { AppShell } from "@/components/AppShell";
import { achievements } from "@/data/achievements";
import { getPublicEnv } from "@/lib/env";

export const dynamic = "force-dynamic";

export default function Home() {
  const publicEnv = getPublicEnv();

  return (
    <AppShell>
      <div className="flex flex-col gap-4 sm:gap-5">
        <AppHero />
        <AchievementBoard achievements={achievements} publicEnv={publicEnv} />
      </div>
    </AppShell>
  );
}
