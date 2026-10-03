import { Camera } from "lucide-react";
import type { Metadata } from "next";
import { EmptyState } from "@/components/site/EmptyState";
import { PageHeader } from "@/components/site/PageHeader";
import { PhotoWall } from "@/components/site/PhotoWall";
import { Reveal } from "@/components/site/Reveal";
import { SocialIcon } from "@/components/site/SocialLinks";
import { getGalleryPhotos } from "@/lib/data";
import { getSettings } from "@/lib/settings";
import { safeHref } from "@/lib/url";

export const metadata: Metadata = {
  title: "Pati Galerisi",
  description: "Üyelerimizin ve takipçilerimizin objektifinden patili dostlarımız.",
};

export default async function GalleryPage() {
  const [settings, photos] = await Promise.all([getSettings(), getGalleryPhotos()]);
  const instagram = safeHref(settings.instagram_url);

  return (
    <>
      <PageHeader eyebrow="Sizden gelenler" title="Pati Galerisi">
        {settings.gallery_intro ? (
          <p className="whitespace-pre-line">{settings.gallery_intro}</p>
        ) : (
          <p>Üyelerimizin ve takipçilerimizin objektifinden kampüsün ve şehrin patili dostları.</p>
        )}
      </PageHeader>

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        {photos.length === 0 ? (
          <EmptyState title="Galeri boş">İlk kareler yakında burada!</EmptyState>
        ) : (
          <PhotoWall
            filterable
            photos={photos.map((photo) => ({
              src: photo.image_url,
              caption: photo.caption,
              credit: photo.credit,
              album: photo.album,
            }))}
          />
        )}

        <Reveal className="card bg-ink text-paper shadow-hard-red mt-16 flex flex-wrap items-center justify-between gap-4 p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <Camera className="text-brand size-10 shrink-0" aria-hidden="true" />
            <div>
              <p className="font-display text-2xl font-extrabold">Senin de bir karen mi var?</p>
              <p className="text-paper/80">Patili dostların fotoğrafını gönder, galerimizde yer alsın.</p>
            </div>
          </div>
          {instagram && (
            <a href={instagram} target="_blank" rel="noopener noreferrer" className="btn btn-red">
              <SocialIcon name="instagram" className="size-5" /> Instagram&apos;dan gönder
            </a>
          )}
        </Reveal>
      </div>
    </>
  );
}
