import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "docs",
  description:
    "Request shapes, parameters and headers for the waldrand.dev endpoints.",
};

export default function DocsLayout({ children }: { children: ReactNode }) {
  return children;
}
