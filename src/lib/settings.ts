import { cache } from "react";
import type { LatLng } from "@/lib/admin/types";
import { isLatLng } from "@/lib/map";
import { getPublicClient } from "@/lib/supabase/public";

export type Stat = { label: string; value: number; suffix?: string };

/** Panelde "Site Ayarları" sayfasından değiştirilen her şey. */
export interface SiteSettings {
  club_name: string;
  short_name: string;
  university: string;
  tagline: string;
  logo_url: string;

  hero_badge: string;
  hero_title: string;
  hero_text: string;
  hero_image_url: string;
  cta_title: string;
  cta_text: string;

  about_title: string;
  about_text: string;
  about_image_url: string;
  mission: string;
  vision: string;

  stats: Stat[];

  email: string;
  phone: string;
  address: string;
  instagram_url: string;
  x_url: string;
  youtube_url: string;
  tiktok_url: string;
  whatsapp_url: string;
  linkedin_url: string;

  announcement_active: boolean;
  announcement_text: string;
  announcement_link: string;

  membership_open: boolean;
  membership_intro: string;
  suggestions_intro: string;

  adoption_intro: string;
  adoption_terms: string;
  rescue_intro: string;
  vets_intro: string;
  shelters_intro: string;

  support_intro: string;
  iban: string;
  account_holder: string;
  bank_name: string;
  donation_note: string;
  other_support: string;
  projects_intro: string;
  neuter_intro: string;
  neuter_count_offset: number;

  map_center: LatLng | null;
  map_zoom: number;

  pets_enabled: boolean;
}

export const defaultSettings: SiteSettings = {
  club_name: "Patili Dostlar Kulübü",
  short_name: "",
  university: "",
  tagline: "",
  logo_url: "",

  hero_badge: "",
  hero_title: "",
  hero_text: "",
  hero_image_url: "",
  cta_title: "",
  cta_text: "",

  about_title: "",
  about_text: "",
  about_image_url: "",
  mission: "",
  vision: "",

  stats: [],

  email: "",
  phone: "",
  address: "",
  instagram_url: "",
  x_url: "",
  youtube_url: "",
  tiktok_url: "",
  whatsapp_url: "",
  linkedin_url: "",

  announcement_active: false,
  announcement_text: "",
  announcement_link: "",

  membership_open: true,
  membership_intro: "",
  suggestions_intro: "",

  adoption_intro: "",
  adoption_terms: "",
  rescue_intro: "",
  vets_intro: "",
  shelters_intro: "",

  support_intro: "",
  iban: "",
  account_holder: "",
  bank_name: "",
  donation_note: "",
  other_support: "",
  projects_intro: "",
  neuter_intro: "",
  neuter_count_offset: 0,

  map_center: null,
  map_zoom: 15,

  pets_enabled: true,
};

export function mergeSettings(data: unknown): SiteSettings {
  const stored = data && typeof data === "object" ? (data as Partial<SiteSettings>) : {};
  const merged = { ...defaultSettings, ...stored };
  if (!merged.club_name?.trim()) merged.club_name = defaultSettings.club_name;
  if (!Array.isArray(merged.stats)) merged.stats = [];
  if (!isLatLng(merged.map_center)) merged.map_center = null;
  return merged;
}

/** Ziyaretçi sayfaları için ayarlar (istek başına bir kez çekilir). */
export const getSettings = cache(async (): Promise<SiteSettings> => {
  const supabase = await getPublicClient();
  if (!supabase) return defaultSettings;

  const { data, error } = await supabase.from("site_settings").select("data").eq("id", 1).maybeSingle();
  if (error) {
    console.error("Site ayarları okunamadı:", error.message);
    return defaultSettings;
  }
  return mergeSettings(data?.data);
});

/** Metni paragraflara böler (panelde boş satırla ayrılan paragraflar). */
export function paragraphs(text: string | null | undefined): string[] {
  return (text ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}
