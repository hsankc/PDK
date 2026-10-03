import type { Metadata } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import { themeScript } from "@/components/site/ThemeToggle";
import { getSettings } from "@/lib/settings";
import { SITE_URL } from "@/lib/site-url";
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
  const description = settings.tagline || settings.hero_text || undefined;
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: settings.club_name, template: `%s | ${settings.club_name}` },
    description,
    applicationName: settings.club_name,
    icons: { icon: settings.logo_url || "/paw.svg", apple: settings.logo_url || undefined },
    openGraph: {
      type: "website",
      locale: "tr_TR",
      siteName: settings.club_name,
      title: settings.club_name,
      description,
    },
    twitter: { card: "summary_large_image" },
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr" className={`${baloo.variable} ${nunito.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
