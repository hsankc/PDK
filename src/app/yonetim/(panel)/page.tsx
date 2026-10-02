import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Circle,
  HandHeart,
  Heart,
  IdCard,
  MessageSquare,
  Users,
} from "lucide-react";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getAdminSession } from "@/lib/admin/auth";
import { mergeSettings } from "@/lib/settings";

export default async function DashboardPage() {
  const { supabase } = await getAdminSession();
  const now = new Date().toISOString();
  const head = { count: "exact" as const, head: true };

  const [
    settingsResult,
    team,
    events,
    upcoming,
    applications,
    suggestions,
    adoptionApplications,
    waitingAnimals,
    vets,
    shelters,
  ] = await Promise.all([
    supabase.from("site_settings").select("data").eq("id", 1).maybeSingle(),
    supabase.from("team_members").select("id", head),
    supabase.from("events").select("id", head),
    supabase.from("events").select("id", head).gte("starts_at", now),
    supabase.from("membership_applications").select("id", head).eq("status", "yeni"),
    supabase.from("suggestions").select("id", head).eq("status", "yeni"),
    supabase.from("adoption_applications").select("id", head).eq("status", "yeni"),
    supabase.from("adoptions").select("id", head).eq("status", "sahiplendirilebilir"),
    supabase.from("vets").select("id", head),
    supabase.from("shelter_locations").select("id", head),
  ]);
  const settings = mergeSettings(settingsResult.data?.data);

  const cards = [
    {
      label: "Yeni üyelik başvurusu",
      value: applications.count ?? 0,
      href: "/yonetim/uyelik-basvurulari?durum=yeni",
      icon: IdCard,
      highlight: true,
    },
    {
      label: "Yeni sahiplenme başvurusu",
      value: adoptionApplications.count ?? 0,
      href: "/yonetim/sahiplenme-basvurulari?durum=yeni",
      icon: HandHeart,
      highlight: true,
    },
    {
      label: "Yeni istek & öneri",
      value: suggestions.count ?? 0,
      href: "/yonetim/oneriler?durum=yeni",
      icon: MessageSquare,
      highlight: true,
    },
    { label: "Yuva arayan dost", value: waitingAnimals.count ?? 0, href: "/yonetim/sahiplendirme", icon: Heart },
    { label: "Yaklaşan etkinlik", value: upcoming.count ?? 0, href: "/yonetim/etkinlikler", icon: CalendarDays },
    { label: "Ekip üyesi", value: team.count ?? 0, href: "/yonetim/ekip", icon: Users },
  ];

  const checklist = [
    { done: Boolean(settings.logo_url), label: "Logoyu yükle", href: "/yonetim/ayarlar#genel" },
    {
      done: Boolean(settings.hero_text),
      label: "Ana sayfa karşılama yazısını yaz",
      href: "/yonetim/ayarlar#ana-sayfa",
    },
    { done: Boolean(settings.about_text), label: "Hakkımızda yazısını ekle", href: "/yonetim/ayarlar#hakkimizda" },
    { done: settings.stats.length > 0, label: "Sayaçları gir", href: "/yonetim/ayarlar#sayaclar" },
    {
      done: Boolean(settings.instagram_url || settings.email),
      label: "İletişim ve sosyal medya bilgilerini ekle",
      href: "/yonetim/ayarlar#iletisim",
    },
    { done: (team.count ?? 0) > 0, label: "Yönetim ekibini ekle", href: "/yonetim/ekip/yeni" },
    { done: (events.count ?? 0) > 0, label: "İlk etkinliği ekle", href: "/yonetim/etkinlikler/yeni" },
    { done: Boolean(settings.map_center), label: "Harita merkezini seç", href: "/yonetim/ayarlar#harita" },
    {
      done: Boolean(settings.adoption_terms),
      label: "Sahiplendirme şartlarını yaz",
      href: "/yonetim/ayarlar#patili-dostlar",
    },
    { done: (vets.count ?? 0) > 0, label: "Anlaşmalı veterinerleri ekle", href: "/yonetim/veterinerler/yeni" },
    { done: Boolean(settings.iban), label: "Bağış için IBAN bilgisini gir", href: "/yonetim/ayarlar#bagis" },
    { done: (shelters.count ?? 0) > 0, label: "Besleme noktalarını haritaya ekle", href: "/yonetim/yuvalar/yeni" },
  ];
  const doneCount = checklist.filter((item) => item.done).length;

  return (
    <>
      <AdminPageHeader
        title="Hoş geldin!"
        description="Burada yaptığın her değişiklik anında sitede görünür."
        actions={
          <a href="/" target="_blank" rel="noopener noreferrer" className="btn btn-white btn-sm">
            Siteyi aç <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {cards.map((card) => {
          const active = card.highlight && card.value > 0;
          return (
            <Link
              key={card.label}
              href={card.href}
              className={`border-ink hover:shadow-hard rounded-3xl border-2 p-5 transition-all hover:-translate-y-0.5 ${
                active ? "bg-brand text-paper" : "bg-paper"
              }`}
            >
              <card.icon className={`size-6 ${active ? "text-paper" : "text-brand"}`} aria-hidden="true" />
              <p className="font-display mt-3 text-4xl leading-none font-extrabold">{card.value}</p>
              <p className={`mt-1 text-sm font-bold ${active ? "text-paper/85" : "text-ink-soft"}`}>{card.label}</p>
            </Link>
          );
        })}
      </div>

      {doneCount < checklist.length && (
        <section className="card mt-8 p-5 sm:p-7">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="font-display text-xl font-extrabold">Siteyi hazırlama listesi</h2>
              <p className="text-ink-soft text-sm">Bunları doldurunca site tamamen hazır olur.</p>
            </div>
            <p className="font-display text-brand text-lg font-extrabold">
              {doneCount}/{checklist.length}
            </p>
          </div>
          <div className="border-ink bg-mist mt-4 h-3 overflow-hidden rounded-full border-2">
            <div className="bg-brand h-full" style={{ width: `${(doneCount / checklist.length) * 100}%` }} />
          </div>
          <ul className="divide-mist mt-5 divide-y-2">
            {checklist.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="group flex items-center gap-3 py-3">
                  {item.done ? (
                    <CheckCircle2 className="size-5 shrink-0 text-green-700" aria-hidden="true" />
                  ) : (
                    <Circle className="text-ink/30 size-5 shrink-0" aria-hidden="true" />
                  )}
                  <span className={`flex-1 font-bold ${item.done ? "text-ink/40 line-through" : ""}`}>
                    {item.label}
                  </span>
                  {!item.done && (
                    <ArrowRight
                      className="text-ink/40 size-4 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
