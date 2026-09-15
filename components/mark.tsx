/**
 * The waldrand mark — tile, ridge, threshold. Inlined rather than loaded as an
 * image so the threshold line can be animated for the loading state.
 */
export function Mark({
  className,
  loading = false,
}: {
  className?: string;
  /** Renders the loading variant: dimmed ridge, threshold sweeping upward. */
  loading?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      role={loading ? "status" : undefined}
      aria-hidden={loading ? undefined : true}
      aria-label={loading ? "Loading" : undefined}
    >
      <rect width="64" height="64" rx="15" fill="#12100E" />
      <path
        d="M9 49 L22 27 L31 38 L43 19 L55 49 Z"
        fill="#EFECE4"
        className={loading ? "wr-ridge" : undefined}
      />
      <g className={loading ? "wr-sweep" : undefined}>
        <rect
          x="9"
          y="25.5"
          width="46"
          height={loading ? 3.4 : 3}
          fill="#E8552F"
        />
      </g>
    </svg>
  );
}
