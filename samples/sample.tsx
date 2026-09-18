// Port of brand's Button and Status Pill stories (stories/components) to React
import type { ComponentPropsWithoutRef, ReactNode } from "react";

export interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  variation?: "primary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  block?: boolean;
  icon?: ReactNode;
}

export function Button({
  variation = "primary",
  size = "md",
  block = false,
  icon,
  children,
  ...props
}: ButtonProps) {
  const classes = ["kd-btn", `kd-btn--${variation}`];

  if (size !== "md") {
    classes.push(`kd-btn--${size}`);
  }

  if (block) {
    classes.push("kd-btn--block");
  }

  return (
    <button type="button" className={classes.join(" ")} {...props}>
      {icon && (
        <span className="kd-btn__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </button>
  );
}

export interface StatusPillProps {
  label: string;
  variation?: "idle" | "active" | "warning" | "danger" | "offline";
  dot?: boolean;
}

export function StatusPill({ label, variation = "idle", dot = false }: StatusPillProps) {
  return (
    <span className={`kd-status-pill kd-status-pill--${variation}`}>
      {dot ? <span className="kd-status-pill__dot" aria-hidden="true" /> : null}
      {label}
    </span>
  );
}

const PILLS = [
  { label: "Running", variation: "active" },
  { label: "Throttled", variation: "warning" },
  { label: "Failed", variation: "danger" },
  { label: "Offline", variation: "offline" },
] as const satisfies readonly StatusPillProps[];

// The Variations, Icon, Disabled and With Dot stories on one page
export default function Showcase() {
  return (
    <div className="kd-d-flex kd-gap-2 kd-flex-wrap">
      <Button>Primary</Button>
      <Button variation="outline">Outline</Button>
      <Button variation="ghost" icon={<>&rarr;</>} aria-label="Next" />
      <Button variation="danger" size="sm" disabled>
        Disabled
      </Button>
      {PILLS.map((pill) => (
        <StatusPill key={pill.label} {...pill} dot />
      ))}
    </div>
  );
}
