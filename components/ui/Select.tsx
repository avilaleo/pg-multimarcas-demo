"use client";

import { Select as BaseSelect } from "@base-ui/react/select";
import { Check, ChevronDown } from "lucide-react";

export interface SelectItem<T extends string> {
  value: T;
  label: string;
}

interface SelectFieldProps<T extends string> {
  name: string;
  items: SelectItem<T>[];
  value?: T;
  defaultValue?: T;
  placeholder: string;
  label?: string;
  "aria-label"?: string;
  onValueChange?: (value: T) => void;
  className?: string;
  triggerClassName?: string;
  disabled?: boolean;
}

/**
 * Accessible select built on Base UI (spiked in docs/redesign-v3/interaction-system.md:
 * unstyled, React 19/Next 16 compatible, full keyboard + touch support, renders a real
 * hidden <input name=...> so it still works inside our existing <form method="get"> GET
 * navigation for filters — no client-side fetch/JS submit contract change).
 */
export function SelectField<T extends string>({
  name,
  items,
  value,
  defaultValue,
  placeholder,
  label,
  "aria-label": ariaLabel,
  onValueChange,
  className = "",
  triggerClassName = "",
  disabled,
}: SelectFieldProps<T>) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <BaseSelect.Root
          name={name}
          items={items}
          value={value}
          defaultValue={defaultValue}
          onValueChange={(v) => onValueChange?.(v as T)}
          disabled={disabled}
        >
          <BaseSelect.Label className="text-xs font-medium uppercase tracking-wide text-muted">
            {label}
          </BaseSelect.Label>
          <SelectTrigger placeholder={placeholder} ariaLabel={ariaLabel} className={triggerClassName} />
          <SelectPopup items={items} />
        </BaseSelect.Root>
      )}
      {!label && (
        <BaseSelect.Root
          name={name}
          items={items}
          value={value}
          defaultValue={defaultValue}
          onValueChange={(v) => onValueChange?.(v as T)}
          disabled={disabled}
        >
          <SelectTrigger placeholder={placeholder} ariaLabel={ariaLabel} className={triggerClassName} />
          <SelectPopup items={items} />
        </BaseSelect.Root>
      )}
    </div>
  );
}

function SelectTrigger({
  placeholder,
  ariaLabel,
  className,
}: {
  placeholder: string;
  ariaLabel?: string;
  className?: string;
}) {
  return (
    <BaseSelect.Trigger
      aria-label={ariaLabel}
      className={`flex h-10 items-center justify-between gap-2 rounded-sm border border-line bg-paper px-3 text-sm text-ink outline-none transition-colors select-none data-[popup-open]:border-ink hover:border-ink/40 focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/30 data-disabled:cursor-not-allowed data-disabled:opacity-50 ${className}`}
    >
      <BaseSelect.Value placeholder={placeholder} className="truncate data-[placeholder]:text-muted" />
      <BaseSelect.Icon className="shrink-0 text-muted transition-transform duration-150 ease-out data-[popup-open]:rotate-180">
        <ChevronDown className="h-4 w-4" aria-hidden />
      </BaseSelect.Icon>
    </BaseSelect.Trigger>
  );
}

function SelectPopup<T extends string>({ items }: { items: SelectItem<T>[] }) {
  return (
    <BaseSelect.Portal>
      <BaseSelect.Positioner className="z-50 outline-none select-none" sideOffset={4}>
        <BaseSelect.Popup className="max-h-[min(var(--available-height),20rem)] min-w-[var(--anchor-width)] origin-[var(--transform-origin)] overflow-y-auto rounded-md border border-line bg-paper py-1 text-ink shadow-elevated outline-none transition-[transform,opacity] duration-100 ease-out data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 motion-reduce:transition-none">
          <BaseSelect.List>
            {items.map((item) => (
              <BaseSelect.Item
                key={item.value}
                value={item.value}
                className="grid cursor-pointer grid-cols-[1rem_1fr] items-center gap-2 px-3 py-2 text-sm outline-none select-none data-[highlighted]:bg-surface data-[selected]:font-semibold"
              >
                <BaseSelect.ItemIndicator className="col-start-1 text-brand">
                  <Check className="h-3.5 w-3.5" aria-hidden />
                </BaseSelect.ItemIndicator>
                <BaseSelect.ItemText className="col-start-2 truncate">{item.label}</BaseSelect.ItemText>
              </BaseSelect.Item>
            ))}
          </BaseSelect.List>
        </BaseSelect.Popup>
      </BaseSelect.Positioner>
    </BaseSelect.Portal>
  );
}
