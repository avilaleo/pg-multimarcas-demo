import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

// Motion tokens from docs/redesign-v3/interaction-system.md: 120ms hover/press,
// standard easing. motion-safe: keeps the 1px press translate off entirely
// under prefers-reduced-motion (no need for a separate motion-reduce override).
const BASE =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold cursor-pointer select-none " +
  "transition-[color,background-color,border-color,box-shadow] duration-[var(--motion-fast)] ease-[var(--ease-standard)] " +
  "motion-safe:active:translate-y-px " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand " +
  "disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none disabled:active:translate-y-0";

const VARIANTS = {
  primary: "bg-brand text-white hover:bg-brand-dark active:bg-brand-dark",
  secondary: "bg-ink text-white hover:bg-ink-soft active:bg-ink-soft",
  outline: "border border-line bg-white text-ink hover:border-ink active:bg-surface",
  /** Same as outline, styled for a bg-black/dark surface (see Button contrast fix, docs/redesign-v2/README.md item 7). */
  "outline-invert": "border border-line-invert bg-transparent text-white hover:border-white active:bg-white/10",
  ghost: "text-ink hover:bg-black/5 active:bg-black/10",
  whatsapp: "bg-whatsapp text-white hover:bg-whatsapp/90 active:bg-whatsapp/80",
};

const SIZES = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-base",
};

type Variant = keyof typeof VARIANTS;
type Size = keyof typeof SIZES;

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function LinkButton({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: CommonProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={`${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`} {...props}>
      {children}
    </a>
  );
}
