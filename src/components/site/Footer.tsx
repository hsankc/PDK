import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { WalkingCat } from "@/components/pets/WalkingCat";
import { isGroup, navItems, type NavGroup, type NavLink } from "@/lib/nav";
import type { SiteSettings } from "@/lib/settings";
import { LogoMark } from "./Logo";
import { SocialLinks } from "./SocialLinks";

// Menü grupları sütun olur; tek başına duran bağlantılar (İstek & Öneri) ilk sütuna eklenir
const groups = navItems.filter(isGroup);
const groupedHrefs = new Set(groups.flatMap((group) => group.children.map((child) => child.href)));
const singleLinks = navItems.filter(
  (entry): entry is NavLink => !isGroup(entry) && entry.href !== "/" && !groupedHrefs.has(entry.href),
);
const footerGroups: NavGroup[] = groups.map((group, index) =>
  index === 0 ? { ...group, children: [...group.children, ...singleLinks] } : group,
);

export function Footer({ settings }: { settings: SiteSettings }) {
  const year = new Date().getFullYear();
  const hasContact = settings.email || settings.phone || settings.address;

  return (
    <footer className="border-ink bg-ink text-paper relative mt-24 border-t-4">
      {settings.pets_enabled && <WalkingCat />}

      <div className="bg-paws-light">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1fr]">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <LogoMark logoUrl={settings.logo_url} className="size-14" />
              <span className="font-display text-2xl leading-tight font-extrabold">{settings.club_name}</span>
            </Link>
            {settings.university && <p className="text-paper/70 font-bold">{settings.university}</p>}
            {settings.tagline && <p className="text-paper/80 max-w-sm">{settings.tagline}</p>}
            <SocialLinks settings={settings} className="pt-2" />
          </div>

          {footerGroups.map((group) => (
            <div key={group.label}>
              <h2 className="font-display text-brand mb-4 text-lg font-extrabold">{group.label}</h2>
              <ul className="space-y-2">
                {group.children.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-paper/80 hover:text-paper transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
                {group === footerGroups[0] && settings.membership_open && (
                  <li>
                    <Link href="/katil" className="text-paper hover:text-brand font-bold transition-colors">
                      Kulübe Katıl
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          ))}

          {hasContact && (
            <div>
              <h2 className="font-display text-brand mb-4 text-lg font-extrabold">İletişim</h2>
              <ul className="text-paper/80 space-y-3">
                {settings.email && (
                  <li className="flex gap-2.5">
                    <Mail className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
                    <a href={`mailto:${settings.email}`} className="hover:text-paper break-all">
                      {settings.email}
                    </a>
                  </li>
                )}
                {settings.phone && (
                  <li className="flex gap-2.5">
                    <Phone className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
                    <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="hover:text-paper">
                      {settings.phone}
                    </a>
                  </li>
                )}
                {settings.address && (
                  <li className="flex gap-2.5">
                    <MapPin className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
                    <span className="whitespace-pre-line">{settings.address}</span>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        <div className="border-paper/15 border-t">
          <div className="text-paper/60 mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-sm sm:flex-row sm:px-6">
            <p>
              © {year} {settings.club_name}
            </p>
            <Link href="/yonetim" className="hover:text-paper">
              Yönetim
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
