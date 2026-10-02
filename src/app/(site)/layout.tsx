import { PawClicks } from "@/components/pets/PawClicks";
import { PeekingPets } from "@/components/pets/PeekingPets";
import { AnnouncementBar } from "@/components/site/AnnouncementBar";
import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { getSettings } from "@/lib/settings";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { safeHref } from "@/lib/url";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  return (
    <>
      {settings.announcement_active && (
        <AnnouncementBar text={settings.announcement_text} link={safeHref(settings.announcement_link)} />
      )}
      <Navbar
        clubName={settings.club_name}
        shortName={settings.short_name}
        logoUrl={settings.logo_url}
        membershipOpen={settings.membership_open}
      />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />

      {settings.pets_enabled && (
        <>
          <PeekingPets />
          <PawClicks />
        </>
      )}

      {!isSupabaseConfigured && process.env.NODE_ENV !== "production" && (
        <p className="border-ink bg-paper shadow-hard fixed bottom-3 left-1/2 z-[70] -translate-x-1/2 rounded-full border-2 px-4 py-2 text-sm font-bold">
          Supabase bağlı değil: <code>.env.local</code> dosyasını doldurun (README).
        </p>
      )}
    </>
  );
}
