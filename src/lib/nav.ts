export type NavLink = { href: string; label: string; description?: string };
export type NavGroup = { label: string; children: NavLink[] };
export type NavEntry = NavLink | NavGroup;

export const isGroup = (entry: NavEntry): entry is NavGroup => "children" in entry;

/** Öne çıkan menü bağlantısı (kırmızı yazılır). */
export const SUPPORT_HREF = "/destek";

/** Üst menü. Yeni fazlarda eklenen sayfalar buraya eklenir. */
export const navItems: NavEntry[] = [
  { href: "/", label: "Ana Sayfa" },
  {
    label: "Kulüp",
    children: [
      { href: "/hakkimizda", label: "Hakkımızda", description: "Biz kimiz, ne yapıyoruz" },
      { href: "/ekibimiz", label: "Ekibimiz", description: "Yönetim kurulu" },
      { href: "/etkinlikler", label: "Etkinlikler", description: "Takvim ve geri sayım" },
      { href: "/yazilar", label: "Yazı Köşesi", description: "Haberler, anılar, hikâyeler" },
      { href: "/gonullu", label: "Gönüllü Ol & Geçici Yuva", description: "Üye olmadan da destek ol" },
      { href: "/oneri", label: "İstek & Öneri", description: "Bize yaz, isimsiz de olur" },
    ],
  },
  {
    label: "Patili Dostlar",
    children: [
      { href: "/sahiplendirme", label: "Sahiplendirme", description: "Yuva arayan dostlarımız" },
      { href: "/kayip-bulundu", label: "Kayıp & Bulundu", description: "Kaybolan dostları birlikte arayalım" },
      { href: "/iyilestirdiklerimiz", label: "İyileştirdiklerimiz", description: "Önce ve sonra hikâyeleri" },
      { href: "/yuvalar", label: "Yuva & Besleme Noktaları", description: "Haritada mama ve su noktaları" },
      { href: "/veterinerler", label: "Anlaşmalı Veterinerler", description: "Klinikler ve iletişim" },
      { href: "/rehberler", label: "Nasıl Yardım Ederim?", description: "Adım adım rehberler" },
    ],
  },
  {
    label: "Çalışmalarımız",
    children: [
      { href: "/projeler", label: "Projelerimiz", description: "Yürüttüğümüz projeler" },
      { href: "/kisirlastirma", label: "Kısırlaştırma Takvimi", description: "Planlananlar ve sayaç" },
      { href: SUPPORT_HREF, label: "Borçlar & Bağış", description: "Şeffaf hesap, ihtiyaç listesi" },
    ],
  },
  { href: SUPPORT_HREF, label: "Destek Ol" },
];
