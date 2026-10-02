"use client";

import { ExternalLink, LayoutDashboard, LogOut, Menu, Settings, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { PawIcon } from "@/components/pets/PawIcon";
import { resourceGroups, resources } from "@/lib/admin/resources";
import type { MapView } from "@/lib/map";
import { createClient } from "@/lib/supabase/client";
import { MapDefaultsContext } from "./MapDefaults";
import { ResourceIcon } from "./ResourceIcon";

type Props = {
  children: ReactNode;
  email: string | null;
  clubName: string;
  newCounts: Record<string, number>;
  mapView: MapView;
};

export function AdminShell({ children, email, clubName, newCounts, mapView }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <MapDefaultsContext value={mapView}>
      <div className="bg-mist flex min-h-screen">
        {/* Masaüstü kenar menü */}
        <aside className="border-ink bg-ink text-paper sticky top-0 hidden h-screen w-64 shrink-0 border-r-2 lg:block">
          <SidebarContent email={email} clubName={clubName} newCounts={newCounts} />
        </aside>

        {/* Mobil çekmece */}
        {open && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              aria-label="Menüyü kapat"
              className="bg-ink/50 absolute inset-0"
              onClick={() => setOpen(false)}
            />
            <aside className="bg-ink text-paper shadow-hard-lg absolute inset-y-0 left-0 w-72 max-w-[85vw]">
              <SidebarContent
                email={email}
                clubName={clubName}
                newCounts={newCounts}
                onNavigate={() => setOpen(false)}
              />
            </aside>
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-ink bg-paper sticky top-0 z-40 flex h-16 items-center gap-3 border-b-2 px-4 lg:hidden">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="border-ink grid size-10 place-items-center rounded-full border-2"
              aria-label="Menüyü aç"
            >
              <Menu className="size-5" />
            </button>
            <span className="font-display truncate text-lg font-extrabold">Yönetim Paneli</span>
          </header>
          <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-8">{children}</main>
        </div>
      </div>
    </MapDefaultsContext>
  );
}

function SidebarContent({
  email,
  clubName,
  newCounts,
  onNavigate,
}: Omit<Props, "children" | "mapView"> & { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const signOut = async () => {
    await createClient().auth.signOut();
    router.replace("/yonetim/giris");
    router.refresh();
  };

  const linkClass = (active: boolean) =>
    `flex items-center gap-3 rounded-xl px-3 py-2.5 font-bold transition-colors ${
      active ? "bg-brand text-paper" : "text-paper/75 hover:bg-paper/10 hover:text-paper"
    }`;

  return (
    <div className="flex h-full flex-col">
      <div className="border-paper/15 flex items-center gap-3 border-b px-5 py-5">
        <span className="border-paper bg-brand grid size-10 shrink-0 place-items-center rounded-full border-2">
          <PawIcon className="fill-paper size-6" />
        </span>
        <div className="min-w-0">
          <p className="font-display truncate leading-tight font-extrabold">{clubName}</p>
          <p className="text-paper/60 text-xs">Yönetim Paneli</p>
        </div>
        {onNavigate && (
          <button type="button" onClick={onNavigate} className="ml-auto" aria-label="Menüyü kapat">
            <X className="size-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5" onClick={onNavigate}>
        <div className="space-y-1">
          <Link href="/yonetim" className={linkClass(pathname === "/yonetim")}>
            <LayoutDashboard className="size-5" aria-hidden="true" /> Özet
          </Link>
          <Link href="/yonetim/ayarlar" className={linkClass(pathname.startsWith("/yonetim/ayarlar"))}>
            <Settings className="size-5" aria-hidden="true" /> Site Ayarları
          </Link>
        </div>

        {resourceGroups.map((group) => (
          <NavGroup key={group} title={group}>
            {resources
              .filter((resource) => resource.group === group)
              .map((resource) => (
                <Link
                  key={resource.slug}
                  href={`/yonetim/${resource.slug}`}
                  className={linkClass(
                    pathname === `/yonetim/${resource.slug}` || pathname.startsWith(`/yonetim/${resource.slug}/`),
                  )}
                >
                  <ResourceIcon name={resource.icon} className="size-5 shrink-0" />
                  <span className="flex-1 leading-tight">{resource.label}</span>
                  {newCounts[resource.slug] > 0 && (
                    <span className="bg-paper text-brand rounded-full px-2 py-0.5 text-xs font-extrabold">
                      {newCounts[resource.slug]}
                    </span>
                  )}
                </Link>
              ))}
          </NavGroup>
        ))}
      </nav>

      <div className="border-paper/15 space-y-1 border-t px-3 py-4">
        <a href="/" target="_blank" rel="noopener noreferrer" className={linkClass(false)}>
          <ExternalLink className="size-5" aria-hidden="true" /> Siteyi aç
        </a>
        <button type="button" onClick={signOut} className={`${linkClass(false)} w-full`}>
          <LogOut className="size-5" aria-hidden="true" /> Çıkış yap
        </button>
        {email && <p className="text-paper/50 truncate px-3 pt-2 text-xs">{email}</p>}
      </div>
    </div>
  );
}

function NavGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-paper/40 mb-2 px-3 text-xs font-extrabold tracking-widest uppercase">{title}</p>
      <div className="space-y-1">{children}</div>
    </div>
  );
}
