import { AchievementBoard } from "@/components/AchievementBoard";
import { achievements } from "@/data/achievements";

export default function Home() {
  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="border-b border-brass/25 pb-7">
          <div className="mb-4 h-1 w-28 bg-gradient-to-r from-ember via-brass to-transparent shadow-ember" />
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.34em] text-ember">
            Neowtwork
          </p>
          <h1 className="max-w-4xl text-4xl font-black uppercase leading-none tracking-wide text-parchment sm:text-6xl">
            Neowtwork Achievements
          </h1>
          <p className="mt-4 max-w-2xl text-base font-semibold text-bone sm:text-lg">
            Track impossible runs. Share proof. Steal seeds.
          </p>
        </header>

        <AchievementBoard achievements={achievements} />
      </div>
    </main>
  );
}
