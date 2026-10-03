import type { MetadataRoute } from "next";

/** Telefonda "Ana ekrana ekle" denince kullanılan bilgiler. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Patili Dostlar Kulübü",
    short_name: "Patili Dostlar",
    description: "ÇOMÜ Patili Dostlar Kulübü: sahiplendirme, etkinlikler, besleme ve kampüsün patili dostları.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#e30a17",
    lang: "tr",
    icons: [{ src: "/paw.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
