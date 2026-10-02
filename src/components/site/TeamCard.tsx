import { CatFace } from "@/components/pets/CatFace";
import { DogFace } from "@/components/pets/DogFace";
import type { TeamMember } from "@/lib/data";
import { safeHref } from "@/lib/url";
import { SocialIcon } from "./SocialLinks";

export function TeamCard({ member, index, compact = false }: { member: TeamMember; index: number; compact?: boolean }) {
  const tilt = index % 2 === 0 ? "hover:-rotate-1" : "hover:rotate-1";
  const instagram = safeHref(member.instagram_url);
  const linkedin = safeHref(member.linkedin_url);

  return (
    <article
      className={`card group flex h-full flex-col overflow-hidden transition-transform duration-200 hover:-translate-y-1 ${tilt}`}
    >
      <div className="border-ink relative aspect-square overflow-hidden border-b-2">
        {member.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={member.photo_url}
            alt={member.name}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className={`bg-paws-light grid size-full place-items-end justify-center ${index % 2 ? "bg-ink" : "bg-brand"}`}
          >
            {index % 2 ? <DogFace paws className="w-3/4" /> : <CatFace paws className="w-3/4" />}
          </div>
        )}
        {member.role && (
          <span className="sticker bg-paper shadow-hard-sm absolute bottom-3 left-3 max-w-[calc(100%-1.5rem)] truncate">
            {member.role}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl leading-tight font-extrabold">{member.name}</h3>
        {member.department && <p className="text-ink-soft mt-1 text-sm font-bold">{member.department}</p>}
        {!compact && member.bio && <p className="text-ink-soft mt-3 whitespace-pre-line">{member.bio}</p>}

        {!compact && (instagram || linkedin) && (
          <div className="mt-auto flex gap-2 pt-4">
            {instagram && (
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${member.name} Instagram`}
                className="border-ink hover:bg-brand hover:text-paper grid size-10 place-items-center rounded-full border-2 transition-colors"
              >
                <SocialIcon name="instagram" className="size-5" />
              </a>
            )}
            {linkedin && (
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${member.name} LinkedIn`}
                className="border-ink hover:bg-brand hover:text-paper grid size-10 place-items-center rounded-full border-2 transition-colors"
              >
                <SocialIcon name="linkedin" className="size-5" />
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
