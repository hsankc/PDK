import { CalendarHeart } from "lucide-react";
import type { Metadata } from "next";
import { PetPlaceholder } from "@/components/site/adoption/AdoptionCard";
import { BeforeAfter } from "@/components/site/BeforeAfter";
import { EmptyState } from "@/components/site/EmptyState";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { getRescueStories, type RescueStory } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { getSettings, paragraphs } from "@/lib/settings";

export const metadata: Metadata = { title: "İyileştirdiklerimiz" };

export default async function RescuesPage() {
  const [settings, stories] = await Promise.all([getSettings(), getRescueStories()]);

  return (
    <>
      <PageHeader eyebrow="Mutlu sonlar" title="İyileştirdiklerimiz">
        {settings.rescue_intro ? (
          <p className="whitespace-pre-line">{settings.rescue_intro}</p>
        ) : (
          <p>Yaralı ya da hasta bulduğumuz dostlarımızın iyileşme hikâyeleri. Sürgüyü kaydır, farkı gör.</p>
        )}
        {stories.length > 0 && (
          <p className="sticker bg-ink text-paper mt-4 rotate-1">{stories.length} dostumuz iyileşti</p>
        )}
      </PageHeader>

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        {stories.length === 0 ? (
          <EmptyState title="Hikâyeler yakında">İyileştirdiğimiz dostlarımızı burada paylaşacağız.</EmptyState>
        ) : (
          <div className="space-y-20">
            {stories.map((story, index) => (
              <StoryRow key={story.id} story={story} flip={index % 2 === 1} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function StoryRow({ story, flip }: { story: RescueStory; flip: boolean }) {
  const single = story.after_url || story.before_url;

  return (
    <Reveal className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
      <div className={flip ? "lg:order-2" : ""}>
        {story.before_url && story.after_url ? (
          <BeforeAfter before={story.before_url} after={story.after_url} name={story.name} />
        ) : single ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={single} alt={story.name} loading="lazy" className="card aspect-[4/3] w-full object-cover" />
        ) : (
          <div className="card aspect-[4/3] overflow-hidden">
            <PetPlaceholder species={story.species} />
          </div>
        )}
      </div>

      <div>
        <h2 className="font-display text-4xl leading-tight font-extrabold">{story.name}</h2>
        {story.rescued_on && (
          <p className="text-ink-soft mt-2 flex items-center gap-1.5 text-sm font-bold">
            <CalendarHeart className="text-brand size-4" aria-hidden="true" />
            Kurtarıldığı gün: {formatDate(`${story.rescued_on}T12:00:00Z`)}
          </p>
        )}
        {story.summary && <p className="mt-4 text-xl font-bold">{story.summary}</p>}
        {story.story && (
          <div className="prose-club mt-4 text-base">
            {paragraphs(story.story).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        )}
        {story.photos.length > 0 && (
          <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
            {story.photos.map((photo) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={photo}
                src={photo}
                alt=""
                loading="lazy"
                className="border-ink size-20 shrink-0 rounded-xl border-2 object-cover"
              />
            ))}
          </div>
        )}
      </div>
    </Reveal>
  );
}
