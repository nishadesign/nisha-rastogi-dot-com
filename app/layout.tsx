import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { BottomNav } from "@/components/layout/BottomNav";
import { TopBrand } from "@/components/layout/TopBrand";
import { Footer } from "@/components/layout/Footer";
import { profile } from "@/data/profile";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://nisha-rastogi.com"),
  title: {
    default: `${profile.name} — ${profile.title}`,
    template: `%s — ${profile.name}`,
  },
  description: profile.positioning,
  openGraph: {
    title: `${profile.name} — ${profile.title}`,
    description: profile.positioning,
    type: "website",
    url: "https://nisha-rastogi.com",
    siteName: profile.name,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${profile.name} — ${profile.title}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.title}`,
    description: profile.positioning,
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <TopBrand />
        {children}
        <Footer />
        <BottomNav />
        <Analytics />
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async></script>
      </body>
    </html>
  );
}
