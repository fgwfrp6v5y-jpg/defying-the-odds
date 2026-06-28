import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

type Props = {
  label: string;
  children: ReactNode;
  hint?: string;
};

export function Field({ label, hint, children }: Props) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-ink">
      <span>{label}</span>
      {children}
      {hint ? <span className="text-xs font-medium text-moss">{hint}</span> : null}
    </label>
  );
}

export const inputClass =
  "focus-ring min-h-11 w-full rounded border border-ink/15 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-moss/60";

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={inputClass} {...props} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`${inputClass} min-h-28 resize-y`} {...props} />;
}
