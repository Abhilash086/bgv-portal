import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "cn";

export type DropdownOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

type DropdownProps = {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  /** Accessible name when no visible `label` is provided. */
  ariaLabel?: string;
  /** Which way the menu opens. Use "up" for controls near the bottom edge. */
  direction?: "down" | "up";
};

/**
 * A single-select dropdown themed with the app's design tokens, so it tracks
 * light/dark automatically. For multi-item action menus use the base-ui
 * DropdownMenu instead; this is the "pick one value" control.
 */
export function Dropdown({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  label,
  disabled = false,
  className,
  ariaLabel,
  direction = "down",
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const labelId = useId();

  const selected = options.find((option) => option.value === value);

  // Close on outside click.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  const commit = (optionValue: string) => {
    onChange(optionValue);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className={cn("relative w-full", className)}>
      {label && (
        <label
          id={labelId}
          className="mb-1.5 block text-sm font-medium text-foreground"
        >
          {label}
        </label>
      )}

      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={label ? labelId : undefined}
        aria-label={!label ? ariaLabel : undefined}
        onClick={() => setOpen((previous) => !previous)}
        className={cn(
          "flex h-9 w-full items-center justify-between gap-2 rounded-lg border border-input bg-transparent px-3 text-sm whitespace-nowrap transition-colors outline-none",
          "hover:bg-muted/40 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "dark:bg-input/30 dark:hover:bg-input/50",
          open && "border-ring ring-3 ring-ring/50",
        )}
      >
        <span className={cn("truncate", !selected && "text-muted-foreground")}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-labelledby={label ? labelId : undefined}
          className={cn(
            "absolute inset-x-0 z-50 overflow-hidden rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10",
            "animate-in fade-in-0 zoom-in-95 duration-100",
            direction === "up"
              ? "bottom-full mb-1.5 slide-in-from-bottom-1"
              : "top-full mt-1.5 slide-in-from-top-1",
          )}
        >
          <div className="max-h-64 overflow-y-auto">
            {options.map((option, index) => {
              const isSelected = option.value === value;
              const isActive = index === activeIndex;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  disabled={option.disabled}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => commit(option.value)}
                  className={cn(
                    "relative flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                    "disabled:pointer-events-none disabled:opacity-50",
                    isActive && "bg-accent text-accent-foreground",
                    isSelected && "font-medium",
                  )}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected && (
                    <Check className="size-4 shrink-0 text-primary" />
                  )}
                </button>
              );
            })}

            {options.length === 0 && (
              <p className="px-2 py-5 text-center text-sm text-muted-foreground">
                No options available
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
