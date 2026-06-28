import clsx from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  children: ReactNode;
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        "focus-ring inline-flex min-h-10 items-center justify-center gap-2 rounded px-4 py-2 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-55",
        variant === "primary" && "bg-ink text-white hover:bg-ink/90",
        variant === "secondary" && "bg-white text-ink ring-1 ring-ink/15 hover:bg-sage/30",
        variant === "ghost" && "text-ink hover:bg-ink/5",
        variant === "danger" && "bg-coral text-white hover:bg-coral/90",
        className
      )}
      {...props}
    />
  );
}
