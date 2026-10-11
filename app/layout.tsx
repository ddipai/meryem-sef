import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Meryem Şef · Tarif Atölyesi",
  description: "Malzemelerini seç, Meryem Şef ile sofrana uygun tarifi bul.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="antialiased">{children}</body>
    </html>
  );
}
