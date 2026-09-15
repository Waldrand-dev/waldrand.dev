import type { ReactNode } from "react";

/** A shell prompt line: accent `$`, command in mono. */
export function Command({ children }: { children: ReactNode }) {
  return (
    <p className="mb-6 font-mono text-[14.5px] text-fg">
      <span className="mr-2.5 text-accent">$</span>
      {children}
    </p>
  );
}

/** Command output — dim by default, with `<b>` picking out the values. */
export function Output({ children }: { children: ReactNode }) {
  return (
    <pre className="m-0 font-mono text-[13.5px] leading-[1.85] break-words whitespace-pre-wrap text-fg-faint [&_b]:font-medium [&_b]:text-fg">
      {children}
    </pre>
  );
}
