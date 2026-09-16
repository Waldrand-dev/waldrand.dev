import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Archivo, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";

import { BootCurtain } from "@/components/boot-curtain";
import { Masthead } from "@/components/masthead";
import { SiteFooter } from "@/components/site-footer";
import { LanguageProvider } from "@/lib/i18n";
import { asset } from "@/lib/paths";

import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://waldrand.dev"),
  title: {
    default: "waldrand.dev — api surface",
    template: "%s — waldrand.dev",
  },
  description:
    "Free, keyless GET endpoints: avatars today, with placeholder images, QR codes and colour palettes planned. No account, no token.",
  applicationName: "waldrand.dev",
  manifest: asset("/site.webmanifest"),
  icons: {
    icon: [
      { url: asset("/assets/logo/favicon.svg"), type: "image/svg+xml" },
      { url: asset("/assets/logo/png/favicon-32.png"), sizes: "32x32" },
      { url: asset("/assets/logo/png/favicon-16.png"), sizes: "16x16" },
    ],
    apple: asset("/assets/logo/png/apple-touch-icon.png"),
  },
  openGraph: {
    type: "website",
    siteName: "waldrand.dev",
    title: "waldrand.dev — api surface",
    description: "Free, keyless GET endpoints. No account, no token.",
    images: ["/assets/logo/png/og-image-1200x630.png"],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#12100E",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${plexSans.variable} ${plexMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        <LanguageProvider>
          <BootCurtain />
          <Masthead />
          <main className="flex flex-1 flex-col">{children}</main>
          <SiteFooter />
        </LanguageProvider>
      </body>
    </html>
  );
}
