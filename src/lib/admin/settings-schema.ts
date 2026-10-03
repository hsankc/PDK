import type { SettingsGroup } from "./types";

/** "Site Ayarları" sayfasındaki bölümler. Yeni ayar eklemek için buraya ve SiteSettings tipine ekle. */
export const settingsGroups: SettingsGroup[] = [
  {
    id: "genel",
    title: "Genel",
    description: "Kulübün adı ve logosu menüde, alt bilgide ve tarayıcı sekmesinde görünür.",
    fields: [
      { name: "club_name", label: "Kulüp adı", type: "text", required: true, half: true },
      { name: "short_name", label: "Kısa ad", type: "text", half: true, help: "Mobil menüde kullanılır. Örn: PDK" },
      { name: "university", label: "Üniversite / kurum", type: "text", half: true },
      {
        name: "tagline",
        label: "Slogan",
        type: "text",
        half: true,
        help: "Alt bilgide ve arama motorlarında görünür.",
      },
      { name: "logo_url", label: "Logo", type: "image", help: "Kare, şeffaf arka planlı PNG en iyisi." },
    ],
  },
  {
    id: "ana-sayfa",
    title: "Ana sayfa",
    description: "Ana sayfanın en üstündeki karşılama alanı.",
    fields: [
      { name: "hero_badge", label: "Üstteki küçük etiket", type: "text", placeholder: "Örn: 2026 dönemi başladı!" },
      { name: "hero_title", label: "Büyük başlık", type: "text", help: "Boş bırakılırsa kulüp adı yazar." },
      { name: "hero_text", label: "Açıklama", type: "textarea", rows: 3 },
      {
        name: "hero_image_url",
        label: "Görsel",
        type: "image",
        help: "Boş bırakılırsa animasyonlu kedi ve köpek çizimi görünür.",
      },
      {
        name: "cta_title",
        label: "Alttaki kırmızı çağrı alanı: başlık",
        type: "text",
        help: 'Boş bırakılırsa "Sen de aramıza katıl!" yazar.',
      },
      { name: "cta_text", label: "Alttaki kırmızı çağrı alanı: açıklama", type: "textarea", rows: 2 },
    ],
  },
  {
    id: "sayaclar",
    title: "Sayaçlar",
    description: "Ana sayfada kayarak artan sayılar. Örn: 120 kısırlaştırma, 45 sahiplendirme.",
    fields: [{ name: "stats", label: "Sayaçlar", type: "stats" }],
  },
  {
    id: "hakkimizda",
    title: "Hakkımızda",
    description: "Paragrafları ayırmak için araya boş satır bırak.",
    fields: [
      { name: "about_title", label: "Başlık", type: "text" },
      { name: "about_text", label: "Kulübü anlatan yazı", type: "textarea", rows: 8 },
      { name: "about_image_url", label: "Görsel", type: "image" },
      { name: "mission", label: "Misyonumuz", type: "textarea", rows: 4, half: true },
      { name: "vision", label: "Vizyonumuz", type: "textarea", rows: 4, half: true },
    ],
  },
  {
    id: "iletisim",
    title: "İletişim ve sosyal medya",
    description: "Boş bırakılanlar sitede görünmez.",
    fields: [
      { name: "email", label: "E-posta", type: "email", half: true },
      { name: "phone", label: "Telefon", type: "tel", half: true },
      { name: "address", label: "Adres", type: "textarea", rows: 2 },
      { name: "instagram_url", label: "Instagram bağlantısı", type: "url", half: true },
      { name: "x_url", label: "X (Twitter) bağlantısı", type: "url", half: true },
      { name: "youtube_url", label: "YouTube bağlantısı", type: "url", half: true },
      { name: "tiktok_url", label: "TikTok bağlantısı", type: "url", half: true },
      {
        name: "whatsapp_url",
        label: "WhatsApp bağlantısı",
        type: "url",
        half: true,
        help: "Örn: https://wa.me/905xxxxxxxxx",
      },
      { name: "linkedin_url", label: "LinkedIn bağlantısı", type: "url", half: true },
    ],
  },
  {
    id: "duyuru",
    title: "Duyuru bandı",
    description: "Sitenin en üstünde kırmızı şerit. Acil ihtiyaçlar ve önemli haberler için.",
    fields: [
      { name: "announcement_active", label: "Duyuru bandını göster", type: "boolean" },
      { name: "announcement_text", label: "Duyuru metni", type: "text" },
      { name: "announcement_link", label: "Tıklanınca gidilecek adres", type: "url", help: "İsteğe bağlı." },
    ],
  },
  {
    id: "formlar",
    title: "Formlar",
    fields: [
      { name: "membership_open", label: "Kulüp başvuruları açık", type: "boolean" },
      { name: "membership_intro", label: "Katılım sayfası açıklaması", type: "textarea", rows: 3 },
      { name: "suggestions_intro", label: "İstek & öneri sayfası açıklaması", type: "textarea", rows: 3 },
    ],
  },
  {
    id: "patili-dostlar",
    title: "Patili Dostlar sayfaları",
    description: "Sayfaların başlığının altında görünen kısa açıklamalar.",
    fields: [
      { name: "adoption_intro", label: "Sahiplendirme sayfası açıklaması", type: "textarea", rows: 3 },
      {
        name: "adoption_terms",
        label: "Sahiplendirme şartlarımız",
        type: "textarea",
        rows: 6,
        help: "Her ilanın başvuru formunun üstünde görünür. Her şartı ayrı satıra yaz.",
      },
      { name: "rescue_intro", label: "İyileştirdiklerimiz sayfası açıklaması", type: "textarea", rows: 3 },
      { name: "vets_intro", label: "Veterinerler sayfası açıklaması", type: "textarea", rows: 3 },
      { name: "shelters_intro", label: "Yuvalar sayfası açıklaması", type: "textarea", rows: 3 },
    ],
  },
  {
    id: "bagis",
    title: "Bağış bilgileri",
    description: "Destek Ol sayfasında IBAN kopyalama düğmesi ve QR kodla birlikte görünür.",
    fields: [
      { name: "iban", label: "IBAN", type: "text", placeholder: "TR00 0000 0000 0000 0000 0000 00" },
      { name: "account_holder", label: "Alıcı adı", type: "text", half: true },
      { name: "bank_name", label: "Banka", type: "text", half: true },
      {
        name: "donation_note",
        label: "Açıklama notu",
        type: "text",
        placeholder: "Örn: Açıklamaya “Bağış – Mama” yazmayı unutma",
      },
      {
        name: "other_support",
        label: "Başka nasıl destek olunur?",
        type: "textarea",
        rows: 3,
        help: "Örn: mama bırakma noktası, gönüllü olma. Her maddeyi ayrı satıra yaz.",
      },
    ],
  },
  {
    id: "calismalarimiz",
    title: "Çalışmalarımız sayfaları",
    fields: [
      { name: "support_intro", label: "Destek Ol sayfası açıklaması", type: "textarea", rows: 3 },
      { name: "projects_intro", label: "Projelerimiz sayfası açıklaması", type: "textarea", rows: 3 },
      { name: "neuter_intro", label: "Kısırlaştırma sayfası açıklaması", type: "textarea", rows: 3 },
      {
        name: "neuter_count_offset",
        label: "Siteden önce yapılan kısırlaştırma sayısı",
        type: "number",
        min: 0,
        half: true,
        help: "Sayaca eklenir. Siteye tek tek girilmeyen eski kısırlaştırmalar için.",
      },
    ],
  },
  {
    id: "icerik",
    title: "Yazılar, rehberler, kayıp/bulundu, gönüllü",
    fields: [
      { name: "posts_intro", label: "Yazı Köşesi sayfası açıklaması", type: "textarea", rows: 2 },
      { name: "guides_intro", label: "Rehberler sayfası açıklaması", type: "textarea", rows: 2 },
      { name: "lost_found_intro", label: "Kayıp & Bulundu sayfası açıklaması", type: "textarea", rows: 2 },
      { name: "volunteer_intro", label: "Gönüllü Ol sayfası açıklaması", type: "textarea", rows: 3 },
      { name: "volunteer_open", label: "Gönüllü ve geçici yuva başvuruları açık", type: "boolean" },
    ],
  },
  {
    id: "arsiv",
    title: "Kampüs kedileri, galeri, tarihçe, destekçiler",
    fields: [
      { name: "campus_pets_intro", label: "Kampüs Kedileri sayfası açıklaması", type: "textarea", rows: 2 },
      { name: "facts_intro", label: "Biliyor musun? sayfası açıklaması", type: "textarea", rows: 2 },
      { name: "gallery_intro", label: "Pati Galerisi sayfası açıklaması", type: "textarea", rows: 2 },
      {
        name: "history_intro",
        label: "Tarihçe bölümü açıklaması",
        type: "textarea",
        rows: 2,
        help: "Hakkımızda sayfasındaki zaman çizelgesinin üstünde görünür.",
      },
      { name: "partners_intro", label: "Destekçilerimiz sayfası açıklaması", type: "textarea", rows: 2 },
    ],
  },
  {
    id: "harita",
    title: "Harita",
    description: "Haritaların ilk açıldığı yer. Kampüsü ya da mahallenizi seçin.",
    fields: [
      { name: "map_center", label: "Harita merkezi", type: "location" },
      {
        name: "map_zoom",
        label: "Yakınlık",
        type: "number",
        half: true,
        help: "10 = şehir, 15 = mahalle, 17 = sokak.",
      },
    ],
  },
  {
    id: "gorunum",
    title: "Görünüm",
    fields: [
      {
        name: "pets_enabled",
        label: "Maskotlar açık",
        type: "boolean",
        help: "Köşelerden bakan kedi-köpekler, yürüyen kedi ve tıklayınca çıkan pati izleri.",
      },
    ],
  },
];
