interface WizardProgressProps {
  step: number;
  totalSteps: number;
  stepNames: readonly string[];
}

/**
 * Compact progress bar + "Etapa X de Y" for mobile, plus a horizontal
 * stepper (hidden below sm:) for desktop. Never shows a percentage tied to
 * vehicle valuation — only wizard progress.
 */
export function WizardProgress({ step, totalSteps, stepNames }: WizardProgressProps) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          Etapa {step} de {totalSteps}
        </p>
        <p className="text-xs font-semibold text-ink">{stepNames[step - 1]}</p>
      </div>

      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface">
        <div
          className="h-full rounded-full bg-brand transition-[width] duration-[var(--motion-base)] ease-[var(--ease-standard)]"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        />
      </div>

      <ol className="mt-3 hidden gap-2 sm:flex">
        {stepNames.map((name, index) => {
          const stepIndex = index + 1;
          const isActive = stepIndex === step;
          const isDone = stepIndex < step;
          return (
            <li
              key={name}
              className={`flex-1 truncate rounded-full border px-3 py-1.5 text-center text-xs font-semibold transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] ${
                isActive
                  ? "border-brand bg-brand/5 text-brand"
                  : isDone
                    ? "border-line bg-surface text-ink"
                    : "border-line text-muted"
              }`}
            >
              {name}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
