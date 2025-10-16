import React from "react"
import { CheckIcon } from "lucide-react"

// Utility function to merge class names
function cn(...classes) {
  return classes.filter(Boolean).join(" ")
}

function Checkbox({ className, checked, onCheckedChange, ...props }) {
  function handleChange(e) {
    const isChecked = e?.target?.checked;
    if (typeof onCheckedChange === 'function') onCheckedChange(Boolean(isChecked));
    if (typeof props.onChange === 'function') props.onChange(e);
  }

  return (
    <label className="inline-flex items-center">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={!!checked}
        onChange={handleChange}
        {...props}
      />
      <span
        data-slot="checkbox"
        className={cn(
          "peer border-input dark:bg-input/30 size-4 shrink-0 rounded-[4px] border shadow-xs " +
            "transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 " +
            "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive " +
            "flex items-center justify-center text-current ",
          checked ? "bg-primary text-primary-foreground border-primary" : "bg-transparent",
          className
        )}
      >
        {checked ? <CheckIcon className="size-3.5" /> : null}
      </span>
    </label>
  )
}

export { Checkbox }
