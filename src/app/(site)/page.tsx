import { ArrowRight, CalendarDays, Heart, Lightbulb, MapPin, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { CatFace } from "@/components/pets/CatFace";
import { HeroPets } from "@/components/pets/HeroPets";
import { JsonLd } from "@/components/site/JsonLd";
import { PawIcon } from "@/components/pets/PawIcon";
import { AdoptionCard } from "@/components/site/adoption/AdoptionCard";
import { Countdown } from "@/components/site/Countdown";
import { PostCard } from "@/components/site/PostCard";
import { ProgressBar } from "@/components/site/ProgressBar";
import { Reveal } from "@/components/site/Reveal";
import { StatCounter } from "@/components/site/StatCounter";
import { TeamCard } from "@/components/site/TeamCard";
import {
  getAdoptions,
  getDebts,
  getFactOfTheDay,
  getNeeds,
  getNextEvent,
  getPosts,
  getTeamMembers,
  getUpcomingEvents,
  summarizeDebts,
  type ClubEvent,
  type Fact,
  type Need,
} from "@/lib/data";
import { dateParts, formatDate, formatMoney } from "@/lib/format";
import { getSettings, paragraphs, type SiteSettings } from "@/lib/settings";
import { SITE_URL } from "@/lib/site-url";
import { safeHref } from "@/lib/url";

export default async function HomePage() {
  const [settings, nextEvent, upcoming, team, adoptions, debts, needs, posts, fact] = await Promise.all([
    getSettings(),
    getNextEvent(),
    getUpcomingEvents(4),
    getTeamMembers(),
    getAdoptions(),
    getDebts(),
    getNeeds(),
    getPosts("yazi", 3),
    getFactOfTheDay(),
  ]);
  const aboutFirstParagraph = paragraphs(settings.about_text)[0];
  const waiting = adoptions.filter((animal) => animal.status === "sahiplendirilebilir");
  const debtSummary = summarizeDebts(debts);
  const urgentNeeds = needs.filter((need) => need.is_urgent && !need.is_fulfilled);
  const otherEvents = upcoming.filter((event) => event.id !== nextEvent?.id).slice(0, 3);

  const sameAs = [
    settings.instagram_url,
    settings.x_url,
    settings.youtube_url,
    settings.tiktok_url,
    settings.linkedin_url,
  ]
    .map((url) => safeHref(url))
    .filter((url): url is string => Boolean(url));

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: settings.club_name,
          url: SITE_URL,
          logo: settings.logo_url || undefined,
          description: settings.tagline || undefined,
          email: settings.email || undefined,
          parentOrganization: settings.university
            ? { "@type": "CollegeOrUniversity", name: settings.university }
            : undefined,
          sameAs: sameAs.length ? sameAs : undefined,
        }}
      />
      <Hero settings={settings} />

      {settings.stats.length > 0 && <Stats stats={settings.stats} />}

      {(nextEvent || otherEvents.length > 0) && <UpcomingEvents next={nextEvent} others={otherEvents} />}

      {fact && <FactOfTheDay fact={fact} />}

      {waiting.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="sticker bg-brand text-paper mb-4 -rotate-2">Yuva arıyoruz</p>
              <h2 className="font-display text-4xl font-extrabold sm:text-5xl">Bizi sahiplen!</h2>
            </div>
            <Link href="/sahiplendirme" className="btn btn-white btn-sm">
              {waiting.length > 4 ? `Hepsini gör (${waiting.length})` : "Sahiplendirme"}{" "}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Reveal>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {waiting.slice(0, 4).map((animal, index) => (
              <Reveal key={animal.id} delay={index * 0.08}>
                <AdoptionCard animal={animal} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {aboutFirstParagraph && (
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <Reveal className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <p className="sticker mb-4 rotate-1">Biz kimiz?</p>
              <h2 className="font-display text-4xl leading-tight font-extrabold sm:text-5xl">
                {settings.about_title || "Hakkımızda"}
              </h2>
              <p className="text-ink-soft mt-5 text-lg leading-relaxed">{aboutFirstParagraph}</p>
              <Link href="/hakkimizda" className="btn btn-black mt-7">
                Devamını oku <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
            {settings.about_image_url && (
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={settings.about_image_url}
                  alt=""
                  className="border-ink shadow-hard-lg aspect-[4/3] w-full rotate-2 rounded-[2rem] border-4 object-cover"
                />
              </div>
            )}
          </Reveal>
        </section>
      )}

      {team.length > 0 && (
        <section className="bg-paws border-ink bg-mist border-y-2 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-display text-4xl font-extrabold sm:text-5xl">Ekibimiz</h2>
              <Link href="/ekibimiz" className="btn btn-white btn-sm">
                Tüm ekip <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Reveal>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {team.slice(0, 4).map((member, index) => (
                <Reveal key={member.id} delay={index * 0.08}>
                  <TeamCard member={member} index={index} compact />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {posts.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-4xl font-extrabold sm:text-5xl">Yazı Köşesi&apos;nden</h2>
            <Link href="/yazilar" className="btn btn-white btn-sm">
              Tüm yazılar <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <Reveal key={post.id} delay={index * 0.08}>
                <PostCard post={post} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {(debtSummary.remaining > 0 || urgentNeeds.length > 0) && (
        <SupportTeaser remaining={debtSummary.remaining} percent={debtSummary.percent} urgentNeeds={urgentNeeds} />
      )}

      <JoinCta settings={settings} />
    </>
  );
}

function Hero({ settings }: { settings: SiteSettings }) {
  const title = settings.hero_title || settings.club_name;

  return (
    <section className="bg-paws relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pt-10 pb-16 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:pt-16 lg:pb-24">
        <div className="animate-rise">
          {settings.hero_badge && (
            <p className="sticker shadow-hard-sm mb-6 -rotate-2">
              <PawIcon className="fill-brand size-4" />
              {settings.hero_badge}
            </p>
          )}
          <h1 className="font-display text-5xl leading-[0.95] font-extrabold tracking-tight text-balance sm:text-6xl lg:text-7xl">
            {title}
          </h1>
          <svg
            viewBox="0 0 300 16"
            className="text-brand mt-3 h-4 w-48 sm:w-64"
            aria-hidden="true"
            preserveAspectRatio="none"
          >
            <path
              d="M2 10 Q 40 2 75 9 T 150 9 T 225 9 T 298 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </svg>
          {settings.hero_text && (
            <p className="text-ink-soft mt-6 max-w-xl text-lg leading-relaxed sm:text-xl">{settings.hero_text}</p>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            {settings.membership_open && (
              <Link href="/katil" className="btn btn-red px-7 py-3.5 text-lg">
                Kulübe Katıl <ArrowRight className="size-5" aria-hidden="true" />
              </Link>
            )}
            <Link href="/etkinlikler" className="btn btn-white px-7 py-3.5 text-lg">
              Etkinlikler
            </Link>
          </div>
        </div>

        <div>
          {settings.hero_image_url ? (
            <div className="animate-rise relative mx-auto max-w-md pt-14 [animation-delay:150ms]">
              <CatFace paws className="absolute top-0 left-8 z-10 w-28 sm:w-32" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={settings.hero_image_url}
                alt=""
                className="border-ink shadow-hard-lg relative aspect-[4/5] w-full rotate-2 rounded-[2.5rem] border-4 object-cover"
              />
            </div>
          ) : (
            <HeroPets label={settings.short_name || settings.club_name} />
          )}
        </div>
      </div>
    </section>
  );
}

function Stats({ stats }: { stats: SiteSettings["stats"] }) {
  return (
    <section className="bg-paws-light border-ink bg-ink text-paper border-y-4">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        {stats.map((stat, index) => (
          <Reveal key={`${stat.label}-${index}`} delay={index * 0.08} className="px-2 text-center">
            <p className="font-display text-brand text-5xl leading-none font-extrabold sm:text-6xl">
              <StatCounter value={Number(stat.value) || 0} suffix={stat.suffix} />
            </p>
            <p className="text-paper/80 mt-2 font-bold">{stat.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function UpcomingEvents({ next, others }: { next: ClubEvent | null; others: ClubEvent[] }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      {next && <NextEvent event={next} />}
      {others.length > 0 && (
        <div className={next ? "mt-10" : ""}>
          <Reveal className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-3xl font-extrabold">
              {next ? "Yaklaşan diğer etkinlikler" : "Yaklaşan etkinlikler"}
            </h2>
            {!next && (
              <Link href="/etkinlikler" className="btn btn-white btn-sm">
                Tüm etkinlikler <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            )}
          </Reveal>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {others.map((event, index) => (
              <Reveal key={event.id} delay={index * 0.08}>
                <UpcomingEventLink event={event} />
              </Reveal>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function UpcomingEventLink({ event }: { event: ClubEvent }) {
  const { day, month } = dateParts(event.starts_at);
  const lastDay =
    event.ends_at && formatDate(event.ends_at) !== formatDate(event.starts_at) ? dateParts(event.ends_at).day : null;

  return (
    <Link
      href={`/etkinlikler/${event.id}`}
      className="card group flex h-full items-stretch overflow-hidden transition-transform duration-200 hover:-translate-y-1"
    >
      <div className="border-ink bg-brand text-paper relative w-28 shrink-0 border-r-2">
        {event.cover_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={event.cover_url} alt="" loading="lazy" className="absolute inset-0 size-full object-cover" />
        )}
        <span className="bg-paper text-ink border-ink shadow-hard-sm absolute top-2 left-2 flex flex-col items-center rounded-xl border-2 px-2 py-0.5 leading-none">
          <span className="font-display text-lg font-extrabold">{lastDay ? `${day}–${lastDay}` : day}</span>
          <span className="text-[0.65rem] font-bold uppercase">{month}</span>
        </span>
      </div>
      <div className="flex flex-col gap-1.5 p-4">
        <h3 className="font-display group-hover:text-brand text-lg leading-tight font-extrabold transition-colors">
          {event.title}
        </h3>
        <p className="text-ink-soft flex items-center gap-1.5 text-sm font-bold">
          <CalendarDays className="text-brand size-4 shrink-0" aria-hidden="true" />
          {formatDate(event.starts_at, true)}
        </p>
        {event.location && (
          <p className="text-ink-soft flex items-center gap-1.5 text-sm font-bold">
            <MapPin className="text-brand size-4 shrink-0" aria-hidden="true" />
            <span className="line-clamp-1">{event.location}</span>
          </p>
        )}
      </div>
    </Link>
  );
}

function NextEvent({ event }: { event: ClubEvent }) {
  const { day, month } = dateParts(event.starts_at);

  return (
    <>
      <Reveal>
        <div className="card grid overflow-hidden md:grid-cols-[0.9fr_1.4fr]">
          <div className="border-ink bg-brand relative min-h-56 border-b-2 md:border-r-2 md:border-b-0">
            {event.cover_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={event.cover_url} alt="" className="absolute inset-0 size-full object-cover" />
            ) : (
              <div className="bg-paws-light text-paper absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-8xl leading-none font-extrabold">{day}</span>
                <span className="font-display text-3xl font-bold uppercase">{month}</span>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-4 p-6 sm:p-8">
            <p className="sticker bg-ink text-paper self-start">Sıradaki etkinlik</p>
            <h2 className="font-display text-3xl leading-tight font-extrabold sm:text-4xl">
              <Link href={`/etkinlikler/${event.id}`} className="hover:text-brand transition-colors">
                {event.title}
              </Link>
            </h2>
            <ul className="text-ink-soft flex flex-wrap gap-x-5 gap-y-1.5 font-bold">
              <li className="flex items-center gap-1.5">
                <CalendarDays className="text-brand size-5" aria-hidden="true" />
                {formatDate(event.starts_at, true)}
              </li>
              {event.location && (
                <li className="flex items-center gap-1.5">
                  <MapPin className="text-brand size-5" aria-hidden="true" />
                  {event.location}
                </li>
              )}
            </ul>
            <Countdown target={event.starts_at} />
            <div className="mt-2 flex flex-wrap gap-2">
              <Link href={`/etkinlikler/${event.id}`} className="btn btn-black btn-sm">
                Detaylar
              </Link>
              <Link href="/etkinlikler" className="btn btn-white btn-sm">
                Tüm etkinlikler <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </>
  );
}

function FactOfTheDay({ fact }: { fact: Fact }) {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-4 pb-4 sm:px-6">
      <Reveal>
        <div className="card bg-ink text-paper shadow-hard-red relative flex flex-col gap-5 overflow-hidden p-6 sm:flex-row sm:items-center sm:p-8">
          <span className="bg-brand border-paper grid size-16 shrink-0 -rotate-6 place-items-center rounded-2xl border-2">
            <Lightbulb className="size-8" aria-hidden="true" />
          </span>
          <div className="flex-1">
            <p className="text-brand text-sm font-extrabold tracking-wider uppercase">Günün bilgisi</p>
            <p className="font-display mt-1 text-2xl leading-tight font-extrabold sm:text-3xl">{fact.title}</p>
            {fact.body && <p className="text-paper/80 mt-2">{fact.body}</p>}
          </div>
          <Link href="/biliyor-musun" className="btn btn-white btn-sm shrink-0 self-start sm:self-center">
            Daha fazlası <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

function SupportTeaser({
  remaining,
  percent,
  urgentNeeds,
}: {
  remaining: number;
  percent: number;
  urgentNeeds: Need[];
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-20 sm:px-6">
      <Reveal className="card grid gap-8 p-6 sm:p-10 md:grid-cols-[1.2fr_1fr] md:items-center">
        <div>
          <p className="sticker bg-brand text-paper mb-4 -rotate-2">Desteğine ihtiyacımız var</p>
          {remaining > 0 ? (
            <>
              <h2 className="font-display text-4xl leading-tight font-extrabold sm:text-5xl">
                {formatMoney(remaining)} borcumuz kaldı
              </h2>
              <div className="mt-6 max-w-md">
                <ProgressBar percent={percent} label="Ödenen borç oranı" />
                <p className="text-ink-soft mt-2 text-sm font-bold">%{percent} ödendi, her destek yaklaştırıyor!</p>
              </div>
            </>
          ) : (
            <h2 className="font-display text-4xl leading-tight font-extrabold sm:text-5xl">Acil ihtiyaçlarımız var</h2>
          )}
          <Link href="/destek" className="btn btn-red mt-8 px-7 py-3.5 text-lg">
            <Heart className="size-5 fill-current" aria-hidden="true" /> Destek ol
          </Link>
        </div>
        {urgentNeeds.length > 0 && (
          <ul className="space-y-2">
            {urgentNeeds.slice(0, 4).map((need) => (
              <li key={need.id} className="border-brand flex items-center gap-3 rounded-2xl border-2 px-4 py-3">
                <TriangleAlert className="text-brand size-5 shrink-0" aria-hidden="true" />
                <span className="font-display text-lg font-extrabold">{need.title}</span>
                {need.quantity && <span className="text-ink-soft ml-auto text-sm font-bold">{need.quantity}</span>}
              </li>
            ))}
          </ul>
        )}
      </Reveal>
    </section>
  );
}

function JoinCta({ settings }: { settings: SiteSettings }) {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-20 sm:px-6">
      <Reveal>
        <div className="bg-paws-light border-ink bg-brand text-paper shadow-hard-lg relative overflow-hidden rounded-[2rem] border-4 px-6 py-14 sm:px-12">
          <PawIcon className="fill-paper/15 absolute -right-8 -bottom-10 size-48 -rotate-12" />
          <div className="relative max-w-2xl">
            <h2 className="font-display text-4xl leading-tight font-extrabold sm:text-5xl">
              {settings.cta_title || "Sen de aramıza katıl!"}
            </h2>
            {settings.cta_text && <p className="text-paper/90 mt-4 text-lg">{settings.cta_text}</p>}
            <div className="mt-8 flex flex-wrap gap-3">
              {settings.membership_open && (
                <Link href="/katil" className="btn btn-black px-7 py-3.5 text-lg">
                  Kulübe Katıl
                </Link>
              )}
              <Link href="/oneri" className="btn btn-white px-7 py-3.5 text-lg">
                Bize yaz
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
