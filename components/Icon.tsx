import type { ReactElement } from "react";

// Public list of valid icon keys. Used by admin form dropdowns
// (Services, etc.) to constrain choices to known names. Keep this
// list in sync with the `icons` map inside Icon() — adding a key
// here without a matching SVG renders nothing at runtime; adding
// an SVG without listing here hides it from admin form pickers.
export const ICON_NAMES = [
  "shield",
  "sparkle",
  "building",
  "desk",
  "leaf",
  "wrench",
  "eye",
  "gear",
  "menu",
  "close",
  "arrow",
  "pin",
  "clock",
  "check",
  "phone",
] as const;

export type IconName = (typeof ICON_NAMES)[number];

type IconProps = {
  name: string;
  size?: number;
  color?: string;
};

export function Icon({ name, size = 28, color = "currentColor" }: IconProps) {
  const s = { width: size, height: size, display: "block" as const };
  const icons: Record<string, ReactElement> = {
    shield: (
      <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
        <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.25C16.5 22.15 20 17.25 20 12V6l-8-4z" />
      </svg>
    ),
    sparkle: (
      <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    ),
    building: (
      <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
        <rect x="3" y="3" width="18" height="18" rx="1" />
        <path d="M9 3v18M3 9h6M3 15h6M15 9h3M15 15h3M15 3v6" />
      </svg>
    ),
    desk: (
      <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
        <rect x="2" y="7" width="20" height="10" rx="1" />
        <path d="M7 17v2M17 17v2M2 12h20" />
        <circle cx="12" cy="10" r="1.5" />
      </svg>
    ),
    leaf: (
      <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
        <path d="M17 8C8 10 5.9 16.17 3.82 19.1c-.29.41.26.89.63.55C7.08 17.2 9.69 16 12 16c5 0 9-4 9-9 0 0-1.5 0-4 1z" />
        <path d="M12 16v6" />
      </svg>
    ),
    wrench: (
      <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    eye: (
      <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    gear: (
      <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    ),
    menu: (
      <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    ),
    close: (
      <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    ),
    arrow: (
      <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    ),
    pin: (
      <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    clock: (
      <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    check: (
      <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    phone: (
      <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  };
  return icons[name] ?? null;
}
