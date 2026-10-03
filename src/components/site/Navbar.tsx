"use client";

import { ChevronDown, Heart, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { isGroup, navItems, SUPPORT_HREF, type NavGroup } from "@/lib/nav";
import { ThemeToggle } from "./ThemeToggle";
import { LogoMark } from "./Logo";

type Props = {
  clubName: string;
  shortName: string;
  logoUrl: string;
  membershipOpen: boolean;
};

export function Navbar({ clubName, shortName, logoUrl, membershipOpen }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  // Sayfa değişince menüleri kapat
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
    setOpenGroup(null);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenGroup(null);
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  // "Destek Ol" ayrıca üst menüde de var; iki yer birden işaretlenmesin
  const isGroupActive = (group: NavGroup) =>
    group.children.some((child) => child.href !== SUPPORT_HREF && isActive(child.href));

  return (
    <>
      <header
        className={`bg-paper/95 sticky top-0 z-50 border-b-2 backdrop-blur transition-colors ${
          scrolled ? "border-ink" : "border-transparent"
        }`}
      >
        <div className="mx-auto flex h-18 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" className="group flex min-w-0 items-center gap-3">
            <motion.span whileHover={{ rotate: -12, scale: 1.08 }} transition={{ type: "spring", stiffness: 300 }}>
              <LogoMark logoUrl={logoUrl} />
            </motion.span>
            <span className="font-display truncate text-lg leading-tight font-extrabold">
              <span className="hidden sm:inline">{clubName}</span>
              <span className="sm:hidden">{shortName || clubName}</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Ana menü">
            {navItems.map((item) =>
              isGroup(item) ? (
                <Dropdown
                  key={item.label}
                  group={item}
                  active={isGroupActive(item)}
                  open={openGroup === item.label}
                  onOpenChange={(value) => setOpenGroup(value ? item.label : null)}
                  isActive={isActive}
                />
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`font-display relative items-center gap-1.5 rounded-full px-3.5 py-2 font-bold transition-colors ${
                    item.href === "/" ? "hidden xl:flex" : "flex"
                  } ${item.href === SUPPORT_HREF ? "text-brand hover:text-brand-dark" : "text-ink-soft hover:text-ink"}`}
                >
                  {isActive(item.href) && <ActivePill />}
                  {item.href === SUPPORT_HREF && <Heart className="relative size-4 fill-current" aria-hidden="true" />}
                  <span className={`relative ${isActive(item.href) ? "text-brand" : ""}`}>{item.label}</span>
                </Link>
              ),
            )}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {membershipOpen && (
              <Link href="/katil" className="btn btn-red btn-sm hidden sm:inline-flex">
                Kulübe Katıl
              </Link>
            )}
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="border-ink bg-paper grid size-11 place-items-center rounded-full border-2 lg:hidden"
              aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
              aria-expanded={open}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Menü header dışında: backdrop-blur, fixed konumlandırmayı header'a hapsederdi */}
      <AnimatePresence>
        {open && (
          <motion.nav
            className="bg-paws border-ink bg-paper fixed inset-x-0 top-18 bottom-0 z-50 overflow-y-auto border-t-2 px-4 py-6 lg:hidden"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            aria-label="Mobil menü"
          >
            <ul className="space-y-2">
              {navItems.map((item, index) => (
                <motion.li
                  key={isGroup(item) ? item.label : item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * index }}
                >
                  {isGroup(item) ? (
                    <div className="py-2">
                      <p className="text-ink/50 px-5 pb-1 text-xs font-extrabold tracking-widest uppercase">
                        {item.label}
                      </p>
                      <ul>
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <MobileLink href={child.href} label={child.label} active={isActive(child.href)} small />
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <MobileLink href={item.href} label={item.label} active={isActive(item.href)} />
                  )}
                </motion.li>
              ))}
            </ul>
            {membershipOpen && (
              <Link href="/katil" className="btn btn-black mt-6 w-full py-4 text-lg">
                Kulübe Katıl
              </Link>
            )}
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}

function ActivePill() {
  return (
    <motion.span
      layoutId="nav-active"
      className="bg-brand-soft absolute inset-0 rounded-full"
      transition={{ type: "spring", stiffness: 400, damping: 32 }}
    />
  );
}

function MobileLink({ href, label, active, small }: { href: string; label: string; active: boolean; small?: boolean }) {
  return (
    <Link
      href={href}
      className={`font-display block rounded-2xl border-2 px-5 font-extrabold ${small ? "py-2.5 text-xl" : "py-3.5 text-2xl"} ${
        active ? "border-ink bg-brand text-paper shadow-hard" : "border-transparent"
      }`}
    >
      {label}
    </Link>
  );
}

function Dropdown({
  group,
  active,
  open,
  onOpenChange,
  isActive,
}: {
  group: NavGroup;
  active: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isActive: (href: string) => boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const lastPointer = useRef("");

  // Dışarı tıklanınca kapan
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) onOpenChange(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, onOpenChange]);

  const openNow = () => {
    clearTimeout(closeTimer.current);
    onOpenChange(true);
  };
  const closeSoon = () => {
    closeTimer.current = setTimeout(() => onOpenChange(false), 150);
  };

  return (
    <div
      ref={ref}
      className="relative"
      onPointerEnter={(event) => event.pointerType === "mouse" && openNow()}
      onPointerLeave={(event) => event.pointerType === "mouse" && closeSoon()}
    >
      <button
        type="button"
        onPointerDown={(event) => {
          lastPointer.current = event.pointerType;
        }}
        onClick={(event) => {
          // Fareyle üzerine gelince zaten açılıyor; tıklama menüyü geri kapatmasın.
          // Dokunmatik ve klavyede (detail 0) aç/kapa gibi çalışır.
          if (event.detail > 0 && lastPointer.current === "mouse") onOpenChange(true);
          else onOpenChange(!open);
        }}
        aria-expanded={open}
        className="font-display text-ink-soft hover:text-ink relative flex items-center gap-1 rounded-full px-3.5 py-2 font-bold transition-colors"
      >
        {active && <ActivePill />}
        <span className={`relative ${active ? "text-brand" : ""}`}>{group.label}</span>
        <ChevronDown
          className={`relative size-4 transition-transform ${open ? "rotate-180" : ""} ${active ? "text-brand" : ""}`}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute top-full left-1/2 w-72 -translate-x-1/2 pt-3"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
          >
            <ul className="card p-2">
              {group.children.map((child) => (
                <li key={child.href}>
                  <Link
                    href={child.href}
                    className={`block rounded-2xl px-4 py-2.5 transition-colors ${
                      isActive(child.href) ? "bg-brand text-paper" : "hover:bg-mist"
                    }`}
                  >
                    <span className="font-display block font-extrabold">{child.label}</span>
                    {child.description && (
                      <span className={`block text-sm ${isActive(child.href) ? "text-paper/80" : "text-ink-soft"}`}>
                        {child.description}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
