import {
  BookOpen,
  CalendarDays,
  FolderKanban,
  HandHeart,
  HandHelping,
  Heart,
  HeartPulse,
  IdCard,
  ListChecks,
  MapPin,
  Megaphone,
  MessageSquare,
  PenLine,
  Scissors,
  Search,
  Stethoscope,
  Users,
  Wallet,
} from "lucide-react";
import type { ResourceIcon as IconName } from "@/lib/admin/types";

const icons = {
  users: Users,
  calendar: CalendarDays,
  "id-card": IdCard,
  message: MessageSquare,
  heart: Heart,
  "hand-heart": HandHeart,
  "heart-pulse": HeartPulse,
  stethoscope: Stethoscope,
  "map-pin": MapPin,
  wallet: Wallet,
  "list-checks": ListChecks,
  "folder-kanban": FolderKanban,
  scissors: Scissors,
  pen: PenLine,
  "book-open": BookOpen,
  search: Search,
  megaphone: Megaphone,
  "hand-helping": HandHelping,
} satisfies Record<IconName, unknown>;

export function ResourceIcon({ name, className }: { name: IconName; className?: string }) {
  const Icon = icons[name];
  return <Icon className={className} aria-hidden="true" />;
}
