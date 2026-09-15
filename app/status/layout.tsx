import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "status",
  description:
    "Operational status for the waldrand.dev endpoints. All four are in build.",
};

export default function StatusLayout({ children }: { children: ReactNode }) {
  return children;
}
