import type { Metadata } from "next";
import { SetupNeeded } from "@/components/admin/Notices";
import { LoginForm } from "@/components/admin/LoginForm";
import { getSettings } from "@/lib/settings";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = {
  title: "Yönetici Girişi",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  if (!isSupabaseConfigured) return <SetupNeeded />;
  const settings = await getSettings();
  return <LoginForm clubName={settings.club_name} />;
}
