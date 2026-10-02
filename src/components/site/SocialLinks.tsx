import type { SiteSettings } from "@/lib/settings";
import { safeHref } from "@/lib/url";

type IconProps = { className?: string };
const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const icons = {
  instagram: ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" className={className} {...stroke}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" />
    </svg>
  ),
  x: ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" className={className} {...stroke}>
      <path d="M4 4l11.7 16H20L8.3 4z" />
      <path d="M20 4l-6.6 7.3M10.6 12.7L4 20" />
    </svg>
  ),
  youtube: ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" className={className} {...stroke}>
      <rect x="2.5" y="5" width="19" height="14" rx="4" />
      <path d="M10 9.2l5 2.8-5 2.8z" fill="currentColor" />
    </svg>
  ),
  tiktok: ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" className={className} {...stroke}>
      <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5" />
      <path d="M14 3c.4 2.6 2.4 4.6 5 5" />
    </svg>
  ),
  whatsapp: ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" className={className} {...stroke}>
      <path d="M3.5 20.5l1.4-4.1a8.5 8.5 0 1 1 3.3 3z" />
      <path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.6-2-1-1 .8a4.5 4.5 0 0 1-2.2-2.2l.8-1-1-2z" />
    </svg>
  ),
  linkedin: ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" className={className} {...stroke}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 10.5V16M8 7.8v.01M12 16v-5.5M12 13a2.5 2.5 0 0 1 5 0v3" />
    </svg>
  ),
};

export type SocialKey = keyof typeof icons;

export function SocialIcon({ name, className }: { name: SocialKey; className?: string }) {
  const Icon = icons[name];
  return <Icon className={className} />;
}

export function socialLinks(settings: SiteSettings) {
  const links: { key: SocialKey; label: string; url: string }[] = [
    { key: "instagram", label: "Instagram", url: safeHref(settings.instagram_url) },
    { key: "x", label: "X", url: safeHref(settings.x_url) },
    { key: "youtube", label: "YouTube", url: safeHref(settings.youtube_url) },
    { key: "tiktok", label: "TikTok", url: safeHref(settings.tiktok_url) },
    { key: "whatsapp", label: "WhatsApp", url: safeHref(settings.whatsapp_url) },
    { key: "linkedin", label: "LinkedIn", url: safeHref(settings.linkedin_url) },
  ];
  return links.filter((link) => link.url);
}

export function SocialLinks({ settings, className = "" }: { settings: SiteSettings; className?: string }) {
  const links = socialLinks(settings);
  if (!links.length) return null;
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {links.map((link) => (
        <li key={link.key}>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            title={link.label}
            className="hover:border-brand hover:bg-brand hover:text-paper grid size-11 place-items-center rounded-full border-2 border-current transition-colors"
          >
            <SocialIcon name={link.key} className="size-5" />
          </a>
        </li>
      ))}
    </ul>
  );
}
