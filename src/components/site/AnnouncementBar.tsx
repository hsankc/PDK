import { Megaphone } from "lucide-react";

export function AnnouncementBar({ text, link }: { text: string; link?: string }) {
  if (!text.trim()) return null;

  const content = (
    <span className="font-display mx-auto flex max-w-6xl items-center justify-center gap-2 px-4 py-2 text-center text-sm font-bold sm:text-base">
      <Megaphone className="size-4 shrink-0 -rotate-12" aria-hidden="true" />
      <span>{text}</span>
      {link && <span className="underline decoration-2 underline-offset-2">Detaylar →</span>}
    </span>
  );

  return (
    <div className="border-ink bg-brand text-paper relative z-[51] border-b-2">
      {link ? (
        <a href={link} className="hover:bg-brand-dark block">
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  );
}
