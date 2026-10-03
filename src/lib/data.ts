import { todayInIstanbul } from "@/lib/format";
import { getPublicClient } from "@/lib/supabase/public";

export type TeamMember = {
  id: string;
  name: string;
  role: string | null;
  department: string | null;
  bio: string | null;
  photo_url: string | null;
  instagram_url: string | null;
  linkedin_url: string | null;
  sort_order: number;
};

export type ClubEvent = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  starts_at: string;
  ends_at: string | null;
  cover_url: string | null;
  registration_url: string | null;
  photos: string[];
};

export type Adoption = {
  id: string;
  name: string;
  species: string;
  sex: string | null;
  age_group: string | null;
  age_text: string | null;
  cover_url: string | null;
  photos: string[];
  traits: string | null;
  description: string | null;
  health_notes: string | null;
  vaccinated: boolean;
  neutered: boolean;
  location: string | null;
  status: "sahiplendirilebilir" | "rezerve" | "sahiplendirildi";
};

export type RescueStory = {
  id: string;
  name: string;
  species: string;
  before_url: string | null;
  after_url: string | null;
  photos: string[];
  summary: string | null;
  story: string | null;
  rescued_on: string | null;
};

export type Vet = {
  id: string;
  name: string;
  doctor_name: string | null;
  address: string | null;
  phone: string | null;
  website_url: string | null;
  maps_url: string | null;
  discount_info: string | null;
  services: string | null;
  working_hours: string | null;
  logo_url: string | null;
  is_emergency: boolean;
  lat: number | null;
  lng: number | null;
};

export type ShelterLocation = {
  id: string;
  name: string;
  kind: "besleme" | "su" | "kulube" | "yuva" | "diger";
  description: string | null;
  photo_url: string | null;
  responsible: string | null;
  lat: number;
  lng: number;
};

export type Debt = {
  id: string;
  creditor: string;
  description: string | null;
  amount: number;
  paid_amount: number;
  incurred_on: string | null;
  due_on: string | null;
  receipt_url: string | null;
};

export type Need = {
  id: string;
  title: string;
  description: string | null;
  quantity: string | null;
  is_urgent: boolean;
  is_fulfilled: boolean;
};

export type Project = {
  id: string;
  title: string;
  summary: string | null;
  description: string | null;
  cover_url: string | null;
  photos: string[];
  status: "planlaniyor" | "devam" | "tamamlandi";
  progress: number;
  started_on: string | null;
  finished_on: string | null;
};

export type NeuterRecord = {
  id: string;
  animal_name: string;
  species: string;
  sex: string | null;
  photo_url: string | null;
  scheduled_on: string;
  status: "planlandi" | "yapildi" | "iptal";
  area: string | null;
  note: string | null;
  vets: { name: string } | null;
};

export type Post = {
  id: string;
  kind: "yazi" | "rehber";
  slug: string;
  title: string;
  excerpt: string | null;
  content: unknown;
  cover_url: string | null;
  author_name: string | null;
  category: string | null;
  published_at: string;
};

export type LostFound = {
  id: string;
  kind: "kayip" | "bulundu";
  species: string;
  animal_name: string | null;
  description: string | null;
  area: string | null;
  seen_on: string | null;
  photo_url: string | null;
  photos: string[];
  contact: string | null;
  status: "aktif" | "kavustu";
  created_at: string;
};

function logError(where: string, error: { message: string } | null) {
  if (error) console.error(`${where} okunamadı:`, error.message);
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  const supabase = await getPublicClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("team_members")
    .select("id, name, role, department, bio, photo_url, instagram_url, linkedin_url, sort_order")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  logError("Ekip", error);
  return data ?? [];
}

const EVENT_COLUMNS = "id, title, description, location, starts_at, ends_at, cover_url, registration_url, photos";

export async function getEvents(): Promise<ClubEvent[]> {
  const supabase = await getPublicClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("events")
    .select(EVENT_COLUMNS)
    .eq("is_published", true)
    .order("starts_at", { ascending: true });
  logError("Etkinlikler", error);
  return data ?? [];
}

export async function getEvent(id: string): Promise<ClubEvent | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const supabase = await getPublicClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("events")
    .select(EVENT_COLUMNS)
    .eq("id", id)
    .eq("is_published", true)
    .maybeSingle();
  logError("Etkinlik", error);
  return data;
}

/** Bitiş saati (yoksa başlangıcı) geçmiş etkinlik "geçmiş" sayılır. */
export function isEventPast(event: Pick<ClubEvent, "starts_at" | "ends_at">, now = Date.now()) {
  return new Date(event.ends_at ?? event.starts_at).getTime() < now;
}

/** Etkinlikleri yaklaşan / geçmiş diye ayırır. Bitiş saati geçmeyen etkinlik "yaklaşan" sayılır. */
export async function getEventTimeline() {
  const events = await getEvents();
  const now = Date.now();
  const isPast = (event: ClubEvent) => isEventPast(event, now);

  const upcoming = events.filter((event) => !isPast(event));
  return {
    events,
    upcoming,
    past: events.filter(isPast).reverse(),
    next: upcoming.find((event) => new Date(event.starts_at).getTime() > now) ?? null,
  };
}

// --------------------------------------------------------------- Faz 2

const ADOPTION_COLUMNS =
  "id, name, species, sex, age_group, age_text, cover_url, photos, traits, description, health_notes, vaccinated, neutered, location, status";

const STATUS_ORDER = { sahiplendirilebilir: 0, rezerve: 1, sahiplendirildi: 2 } as const;

/** Önce yuva arayanlar, sonra rezerve olanlar, en sonda yuvasını bulanlar. */
export async function getAdoptions(): Promise<Adoption[]> {
  const supabase = await getPublicClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("adoptions")
    .select(ADOPTION_COLUMNS)
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  logError("Sahiplendirme ilanları", error);
  return ((data ?? []) as Adoption[]).sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);
}

export async function getAdoption(id: string): Promise<Adoption | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const supabase = await getPublicClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("adoptions")
    .select(ADOPTION_COLUMNS)
    .eq("id", id)
    .eq("is_published", true)
    .maybeSingle();
  logError("Sahiplendirme ilanı", error);
  return data as Adoption | null;
}

export async function getRescueStories(): Promise<RescueStory[]> {
  const supabase = await getPublicClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("rescue_stories")
    .select("id, name, species, before_url, after_url, photos, summary, story, rescued_on")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("rescued_on", { ascending: false, nullsFirst: false });
  logError("İyileşme hikâyeleri", error);
  return (data ?? []) as RescueStory[];
}

export async function getVets(): Promise<Vet[]> {
  const supabase = await getPublicClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("vets")
    .select(
      "id, name, doctor_name, address, phone, website_url, maps_url, discount_info, services, working_hours, logo_url, is_emergency, lat, lng",
    )
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  logError("Veterinerler", error);
  return (data ?? []) as Vet[];
}

export async function getShelterLocations(): Promise<ShelterLocation[]> {
  const supabase = await getPublicClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("shelter_locations")
    .select("id, name, kind, description, photo_url, responsible, lat, lng")
    .eq("is_published", true)
    .order("name", { ascending: true });
  logError("Yuva noktaları", error);
  return (data ?? []) as ShelterLocation[];
}

// --------------------------------------------------------------- Faz 3

export async function getDebts(): Promise<Debt[]> {
  const supabase = await getPublicClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("debts")
    .select("id, creditor, description, amount, paid_amount, incurred_on, due_on, receipt_url")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("incurred_on", { ascending: false, nullsFirst: false });
  logError("Borçlar", error);
  // numeric sütunlar bazen metin gelebilir; sayıya çevir
  return (data ?? []).map((debt) => ({ ...debt, amount: Number(debt.amount), paid_amount: Number(debt.paid_amount) }));
}

/** Toplam, ödenen ve kalan borç. Fazla ödeme kalan borcu eksiye düşürmez. */
export function summarizeDebts(debts: Debt[]) {
  const total = debts.reduce((sum, debt) => sum + debt.amount, 0);
  const paid = debts.reduce((sum, debt) => sum + Math.min(debt.paid_amount, debt.amount), 0);
  return { total, paid, remaining: Math.max(0, total - paid), percent: total ? Math.round((paid / total) * 100) : 0 };
}

export async function getNeeds(): Promise<Need[]> {
  const supabase = await getPublicClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("needs")
    .select("id, title, description, quantity, is_urgent, is_fulfilled")
    .eq("is_published", true)
    .order("is_fulfilled", { ascending: true })
    .order("is_urgent", { ascending: false })
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  logError("İhtiyaç listesi", error);
  return data ?? [];
}

const PROJECT_COLUMNS = "id, title, summary, description, cover_url, photos, status, progress, started_on, finished_on";

export async function getProjects(): Promise<Project[]> {
  const supabase = await getPublicClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("projects")
    .select(PROJECT_COLUMNS)
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  logError("Projeler", error);
  return (data ?? []) as Project[];
}

export async function getProject(id: string): Promise<Project | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const supabase = await getPublicClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("projects")
    .select(PROJECT_COLUMNS)
    .eq("id", id)
    .eq("is_published", true)
    .maybeSingle();
  logError("Proje", error);
  return data as Project | null;
}

const NEUTER_COLUMNS = "id, animal_name, species, sex, photo_url, scheduled_on, status, area, note, vets(name)";

/** Kısırlaştırma sayfası: yaklaşan takvim, son yapılanlar ve sayaçlar. */
export async function getNeuterOverview(today: string) {
  const empty = { upcoming: [], recent: [], done: 0, doneThisYear: 0, cats: 0, dogs: 0 };
  const supabase = await getPublicClient();
  if (!supabase) return empty;

  const done = () =>
    supabase
      .from("neuter_records")
      .select("id", { count: "exact", head: true })
      .eq("is_published", true)
      .eq("status", "yapildi");

  const [upcoming, recent, total, thisYear, cats, dogs] = await Promise.all([
    supabase
      .from("neuter_records")
      .select(NEUTER_COLUMNS)
      .eq("is_published", true)
      .eq("status", "planlandi")
      .gte("scheduled_on", today)
      .order("scheduled_on", { ascending: true })
      .limit(60),
    supabase
      .from("neuter_records")
      .select(NEUTER_COLUMNS)
      .eq("is_published", true)
      .eq("status", "yapildi")
      .order("scheduled_on", { ascending: false })
      .limit(12),
    done(),
    done().gte("scheduled_on", `${today.slice(0, 4)}-01-01`),
    done().eq("species", "kedi"),
    done().eq("species", "kopek"),
  ]);
  logError("Kısırlaştırma takvimi", upcoming.error ?? recent.error ?? total.error);

  return {
    upcoming: (upcoming.data ?? []) as unknown as NeuterRecord[],
    recent: (recent.data ?? []) as unknown as NeuterRecord[],
    done: total.count ?? 0,
    doneThisYear: thisYear.count ?? 0,
    cats: cats.count ?? 0,
    dogs: dogs.count ?? 0,
  };
}

// --------------------------------------------------------------- Faz 4

const POST_LIST_COLUMNS = "id, kind, slug, title, excerpt, content, cover_url, author_name, category, published_at";

/** Yazılar en yeniden eskiye, rehberler panelde verilen sıraya göre. */
export async function getPosts(kind: Post["kind"], limit = 100): Promise<Post[]> {
  const supabase = await getPublicClient();
  if (!supabase) return [];
  let query = supabase.from("posts").select(POST_LIST_COLUMNS).eq("kind", kind).eq("is_published", true);
  if (kind === "rehber") query = query.order("sort_order", { ascending: true });
  const { data, error } = await query.order("published_at", { ascending: false }).limit(limit);
  logError(kind === "yazi" ? "Yazılar" : "Rehberler", error);
  return (data ?? []) as Post[];
}

export async function getPost(kind: Post["kind"], slug: string): Promise<Post | null> {
  if (!/^[a-z0-9-]{1,120}$/.test(slug)) return null;
  const supabase = await getPublicClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("posts")
    .select(POST_LIST_COLUMNS)
    .eq("kind", kind)
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  logError("Yazı", error);
  return data as Post | null;
}

export async function getLostFound(): Promise<LostFound[]> {
  const supabase = await getPublicClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("lost_found")
    .select(
      "id, kind, species, animal_name, description, area, seen_on, photo_url, photos, contact, status, created_at",
    )
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(200);
  logError("Kayıp & bulundu", error);
  return (data ?? []) as LostFound[];
}

// ---------------------------------------------------------------------------

export async function getNextEvent(): Promise<ClubEvent | null> {
  const supabase = await getPublicClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("events")
    .select(EVENT_COLUMNS)
    .eq("is_published", true)
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  logError("Sıradaki etkinlik", error);
  return data;
}

/** Henüz bitmemiş etkinlikler (sürmekte olanlar dahil), yakından uzağa. */
export async function getUpcomingEvents(limit = 4): Promise<ClubEvent[]> {
  const supabase = await getPublicClient();
  if (!supabase) return [];
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("events")
    .select(EVENT_COLUMNS)
    .eq("is_published", true)
    .or(`starts_at.gte.${now},ends_at.gte.${now}`)
    .order("starts_at", { ascending: true })
    .limit(limit);
  logError("Yaklaşan etkinlikler", error);
  return data ?? [];
}

// --------------------------------------------------------------- Arşiv

export type CampusPet = {
  id: string;
  name: string;
  species: string;
  title: string | null;
  personality: string | null;
  zodiac: string | null;
  favorite_spot: string | null;
  photo_url: string | null;
  photos: string[];
};

export type Fact = {
  id: string;
  title: string;
  body: string | null;
  category: "kedi" | "kopek" | "genel";
  image_url: string | null;
};

export type GalleryPhoto = {
  id: string;
  image_url: string;
  caption: string | null;
  credit: string | null;
  album: string | null;
  taken_on: string | null;
};

export type Milestone = {
  id: string;
  happened_on: string;
  title: string;
  description: string | null;
  image_url: string | null;
  link_url: string | null;
};

export type Partner = {
  id: string;
  name: string;
  kind: string;
  description: string | null;
  instagram_url: string | null;
  website_url: string | null;
  logo_url: string | null;
};

export async function getCampusPets(): Promise<CampusPet[]> {
  const supabase = await getPublicClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("campus_pets")
    .select("id, name, species, title, personality, zodiac, favorite_spot, photo_url, photos")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  logError("Kampüs kedileri", error);
  return data ?? [];
}

export async function getFacts(): Promise<Fact[]> {
  const supabase = await getPublicClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("facts")
    .select("id, title, body, category, image_url")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  logError("Bilgiler", error);
  return (data ?? []) as Fact[];
}

/** Her gün (İstanbul saatiyle) sıradaki bilgi; liste bitince başa döner. */
export async function getFactOfTheDay(): Promise<Fact | null> {
  const facts = await getFacts();
  if (!facts.length) return null;
  const day = Math.floor(new Date(`${todayInIstanbul()}T00:00:00Z`).getTime() / 86_400_000);
  return facts[day % facts.length];
}

export async function getGalleryPhotos(): Promise<GalleryPhoto[]> {
  const supabase = await getPublicClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("gallery_photos")
    .select("id, image_url, caption, credit, album, taken_on")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(500);
  logError("Galeri", error);
  return data ?? [];
}

export async function getMilestones(): Promise<Milestone[]> {
  const supabase = await getPublicClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("milestones")
    .select("id, happened_on, title, description, image_url, link_url")
    .eq("is_published", true)
    .order("happened_on", { ascending: true });
  logError("Tarihçe", error);
  return data ?? [];
}

export async function getPartners(): Promise<Partner[]> {
  const supabase = await getPublicClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("partners")
    .select("id, name, kind, description, instagram_url, website_url, logo_url")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  logError("Destekçiler", error);
  return data ?? [];
}

// --------------------------------------------------------------- Oyunlar

export type Game = "mama" | "hafiza";

export type GameScore = {
  id: string;
  player_name: string;
  score: number;
  seconds: number | null;
  created_at: string;
};

/** Mama Yakala'da büyük puan, Hafıza Kartları'nda az hamle ve kısa süre önde. */
export async function getLeaderboard(game: Game, limit = 10): Promise<GameScore[]> {
  const supabase = await getPublicClient();
  if (!supabase) return [];
  let query = supabase
    .from("game_scores")
    .select("id, player_name, score, seconds, created_at")
    .eq("game", game)
    .eq("is_published", true);
  query =
    game === "mama"
      ? query.order("score", { ascending: false })
      : query.order("score", { ascending: true }).order("seconds", { ascending: true, nullsFirst: false });
  const { data, error } = await query.order("created_at", { ascending: true }).limit(limit);
  logError("Skor tablosu", error);
  return data ?? [];
}
