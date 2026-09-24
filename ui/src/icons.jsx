import React from 'react';

// Small provider glyphs, one per multiplexer/manager type. Each is 24x24,
// stroke="currentColor" so it inherits the surrounding text color and the
// active/hover states — inline in the dashboard document, not <img>-loaded.

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

const ZellijIcon = (p) => (
  <svg {...base} {...p}>
    {/* Zellij's zigzag Z monogram */}
    <path d="M6 6.5h12L6 17.5h12" />
  </svg>
);

const ScreenIcon = (p) => (
  <svg {...base} {...p}>
    {/* terminal window split into stacked panes (GNU Screen) */}
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <line x1="4" y1="12.5" x2="20" y2="12.5" />
    <path d="M7 8.2 L9.4 10.2 L7 12.2" />
    <line x1="13" y1="15.8" x2="17" y2="15.8" opacity="0.55" />
  </svg>
);

const TmuxIcon = (p) => (
  <svg {...base} {...p}>
    {/* tiled panes split vertically (tmux) */}
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <line x1="12.5" y1="4" x2="12.5" y2="20" />
    <path d="M6.6 8.2 L9 10.2 L6.6 12.2" />
    <circle cx="16" cy="9.2" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const HerdrIcon = (p) => (
  <svg {...base} {...p}>
    {/* swarm hub: one lead agent orbited by two nodes */}
    <circle cx="12" cy="12" r="4.2" />
    <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
    <circle cx="7.8" cy="12" r="0.9" fill="currentColor" stroke="none" />
    <circle cx="16.2" cy="12" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

const AoeIcon = (p) => (
  <svg {...base} {...p}>
    {/* crown for agent-of-empires */}
    <path d="M6 15.5 L7.4 8.4 L10.4 11.4 L12 7.2 L13.6 11.4 L16.6 8.4 L18 15.5 Z" />
    <line x1="6" y1="18" x2="18" y2="18" />
  </svg>
);

const CustomIcon = (p) => (
  <svg {...base} {...p}>
    {/* a pencil: manual/custom command */}
    <path d="M12 4.5 L14 8 H10 Z" />
    <path d="M10 8 h4 v8.5 h-4 Z" />
    <line x1="10" y1="11.2" x2="14" y2="11.2" opacity="0.5" />
  </svg>
);

const ICONS = {
  zellij: ZellijIcon,
  screen: ScreenIcon,
  tmux: TmuxIcon,
  herdr: HerdrIcon,
  aoe: AoeIcon,
  custom: CustomIcon,
};

export function ProviderIcon({ id, ...rest }) {
  const C = ICONS[id] || CustomIcon;
  return <C {...rest} />;
}

export default ProviderIcon;
