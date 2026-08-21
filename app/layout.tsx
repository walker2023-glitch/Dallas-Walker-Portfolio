import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { NavShell } from "@/components/layout/NavShell";
import { site } from "@/config/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${site.fullName} — ${site.tagline}`,
    template: `%s // ${site.brand}`,
  },
  description:
    "Portfolio of Dallas Walker — Computer Science & Statistics student building AI, systems, and full-stack tools.",
  authors: [{ name: site.fullName }],
  metadataBase: new URL("http://localhost:3000"),
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Material Symbols isn't exposed by next/font/google; load the
            variable-icon stylesheet directly. Preconnect to keep it fast. */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className="bg-background text-on-background antialiased min-h-screen">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-primary focus:text-on-primary focus:px-3 focus:py-2 focus:font-code-label focus:text-code-label"
        >
          Skip to main content
        </a>
        <NavShell>{children}</NavShell>
      </body>
    </html>
  );
}
