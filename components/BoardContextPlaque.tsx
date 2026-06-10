type BoardContextPlaqueProps = {
  description: string;
  label: string;
  username: string;
};

export function BoardContextPlaque({
  description,
  label,
  username,
}: BoardContextPlaqueProps) {
  return (
    <section className="board-context-plaque" aria-label="Current board">
      <p className="text-[0.65rem] font-black uppercase tracking-ritual text-emberBright">
        {label}
      </p>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <p className="text-lg font-black uppercase tracking-title text-parchment">
          Viewing @{username}
        </p>
        <p className="max-w-xl text-sm font-semibold text-bone">{description}</p>
      </div>
    </section>
  );
}
