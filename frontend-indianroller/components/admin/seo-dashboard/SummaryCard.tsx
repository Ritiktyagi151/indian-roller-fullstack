import type { SummaryCardData } from "./types";

type SummaryCardProps = {
  card: SummaryCardData;
};

export default function SummaryCard({ card }: SummaryCardProps) {
  const Icon = card.icon;

  return (
    <article className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {card.title}
          </p>
          <h3 className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">
            {card.value}
          </h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{card.hint}</p>
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${card.accent} text-white shadow-lg`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </article>
  );
}
