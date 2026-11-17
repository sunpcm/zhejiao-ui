type IconProps = { className?: string };

export function IconAlert({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path d="M8 2.5 L14 13.5 H2 Z" />
      <path d="M8 6.5 V9.5" />
      <path d="M8 11.5 H8.01" />
    </svg>
  );
}

export function IconPage({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path d="M4 2.5 H10 L12.5 5 V13.5 H4 Z" />
      <path d="M10 2.5 V5 H12.5" />
    </svg>
  );
}
