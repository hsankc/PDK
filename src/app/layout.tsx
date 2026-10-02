import type { Metadata } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import { getSettings } from "@/lib/settings";
import "./globals.css";

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin", "latin-ext"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin", "latin-ext"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: { default: settings.club_name, template: `%s | ${settings.club_name}` },
    description: settings.tagline || settings.hero_text || undefined,
    icons: { icon: settings.logo_url || "/paw.svg" },
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr" className={`${baloo.variable} ${nunito.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
