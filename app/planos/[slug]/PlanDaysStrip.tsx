"use client";

interface PlanDayChip {
  id: string;
  index: number;
  labelDate?: string;
}

interface PlanDaysStripProps {
  days: PlanDayChip[];
  currentDay: number | null;
}

export function PlanDaysStrip({ days, currentDay }: PlanDaysStripProps) {
  function handleClick(index: number) {
    const el = document.getElementById(`plan-day-${index}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {days.map((day) => {
        const isCurrent = currentDay === day.index;

        return (
          <button
            key={day.id}
            type="button"
            onClick={() => handleClick(day.index)}
            className={[
              "min-w-[64px] rounded-xl border px-3 py-2 text-center transition",
              "focus:outline-none focus:ring-2 focus:ring-amber-400",
              isCurrent
                ? "border-amber-400 bg-amber-500/10"
                : "border-slate-700 bg-slate-900/80 hover:border-amber-400/60",
            ].join(" ")}
          >
            <p className="text-xs font-semibold text-slate-50">
              {day.index}
            </p>
            {day.labelDate && (
              <p className="text-[10px] text-slate-400 mt-1">
                {day.labelDate}
              </p>
            )}
          </button>
        );
      })}
    </div>
  );
}
