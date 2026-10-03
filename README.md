# Patili Dostlar Kulübü — Web Sitesi

Kırmızı-siyah-beyaz, animasyonlu (köşeden bakan kedi-köpekler, yürüyen kedi, pati izleri) kulüp sitesi.
Sitedeki bütün yazı ve resimler **yönetim panelinden** (`/yonetim`) değiştirilir; kod bilmek gerekmez.

Fazlar ve durum: [ROADMAP.md](ROADMAP.md)

---

## 1. Supabase kurulumu (bir kere yapılır)

1. [supabase.com](https://supabase.com) → **New project**. Bölge olarak **Frankfurt (eu-central-1)** seç (Türkiye'ye en yakın).
2. **SQL Editor → New query** → [`supabase/migrations/`](supabase/migrations/) klasöründeki dosyaları **sırayla**
   (`0001_temel.sql`, `0002_patili_dostlar.sql`, …) yapıştır → **Run**. Her biri tekrar çalıştırılabilir.
3. **Authentication → Sign In / Providers → Email** altında **"Allow new users to sign up"** seçeneğini kapat.
   (Sitede kayıt ekranı yok; yöneticileri sen ekliyorsun.)
4. **Authentication → Users → Add user → Create new user**: Nehir'in e-postası + şifre, **Auto Confirm User** işaretli.
5. **SQL Editor** → [`supabase/yonetici-ekle.sql`](supabase/yonetici-ekle.sql) içindeki e-postayı değiştir → **Run**.
   Bu adım o hesabı yönetici yapar. Her yeni yönetici için 4 ve 5'i tekrarla.
6. **Project Settings → API Keys** sayfasından **Project URL** ve **Publishable key**'i al.

## 2. Bilgisayarda çalıştırma

```bash
npm install
```

`.env.example` dosyasını `.env.local` adıyla kopyala, 6. adımdaki değerleri yaz. Sonra:

```bash
npm run dev
```

- Site: http://localhost:3000
- Panel: http://localhost:3000/yonetim

## 3. Yönetim paneli (Nehir için)

| Menü                           | Ne işe yarar                                                                                                            |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| **Özet**                       | Yeni başvuru ve öneri sayıları + "siteyi hazırlama listesi"                                                             |
| **Site Ayarları**              | Kulüp adı, logo, ana sayfa yazıları, sayaçlar, Hakkımızda, iletişim, sosyal medya, duyuru bandı, maskotları açma/kapama |
| **Yönetim Ekibi**              | Ekip üyeleri (fotoğraf, görev, sıra)                                                                                    |
| **Etkinlikler**                | Etkinlikler; en yakın etkinlik ana sayfada geri sayımla görünür. Bitince "Etkinlikten fotoğraflar"a kareleri ekle       |
| **Sahiplendirme**              | Yuva arayan dostlar; sahiplenilince durumu "Yuvasını buldu" yap, "Mutlu sonlar"a geçer                                  |
| **İyileştirdiklerimiz**        | Önce/sonra fotoğrafları ve iyileşme hikâyeleri                                                                          |
| **Anlaşmalı Veterinerler**     | Klinikler; konum girilirse haritada görünür                                                                             |
| **Yuva & Besleme Noktaları**   | Haritadaki mama, su, kulübe noktaları. Noktanın yanındaysan "Konumumu kullan"                                           |
| **Yazı Köşesi**                | Blog yazıları; Word benzeri editörle başlık, liste, bağlantı ve resim eklenir                                           |
| **Tarihçe**                    | Hakkımızda sayfasındaki zaman çizelgesi (tarih, başlık, görsel, haber bağlantısı)                                       |
| **Destekçilerimiz**            | Birlikte çalışılan kurum, kulüp ve işletmeler                                                                           |
| **Kampüs Kedileri**            | Kampüsün yerlileri: lakap, burç, karakter, fotoğraflar                                                                  |
| **Pati Galerisi**              | Üyelerden ve takipçilerden gelen fotoğraflar; aynı albüm adı sitede filtre olur                                         |
| **Biliyor musun?**             | Kısa bilgiler; ana sayfada her gün biri "Günün bilgisi" olur                                                            |
| **Rehberler**                  | "Nasıl yardım ederim?" yazıları; sıra numarasıyla listelenir                                                            |
| **Kayıp & Bulundu**            | Sitedeki ilanlar; sahibine kavuşunca durumu "Kavuştu" yap                                                               |
| **Kısırlaştırma**              | Planlananlar takvimde, "Yapıldı" olanlar sayaçta görünür                                                                |
| **Projelerimiz**               | Projeler, durum ve ilerleme yüzdesi                                                                                     |
| **Borçlar**                    | Destek Ol sayfasında şeffaf borç listesi; ödeme yaptıkça "Ödenen"i güncelle                                             |
| **İhtiyaç Listesi**            | Mama, kum, ilaç…; "Acil" ve "Karşılandı" işaretlenebilir                                                                |
| **Üyelik Başvuruları**         | "Kulübe Katıl" formundan gelenler; durum ve ekip notu eklenebilir                                                       |
| **Sahiplenme Başvuruları**     | İlan sayfalarındaki formdan gelenler                                                                                    |
| **Kayıp/Bulundu Bildirimleri** | Ziyaretçi bildirimleri; "İlan taslağı oluştur" ile tek tıkla ilana çevrilir                                             |
| **Gönüllü & Geçici Yuva**      | Gönüllü ol formundan gelenler                                                                                           |
| **İstek & Öneriler**           | Öneri köşesinden gelenler; açınca "okundu" olur                                                                         |

- Fotoğraflar yüklenirken otomatik küçültülür, telefondan çekilen büyük fotoğraflar sorun olmaz.
- Paragrafları ayırmak için araya **boş satır** bırak.
- Yapılan her değişiklik **anında** sitede görünür.
- Şifre unutulursa: Supabase → Authentication → Users → kullanıcı → **Send password recovery** ya da yeni şifre belirle.

## 4. Yayına alma (Faz 5'te)

[Vercel](https://vercel.com)'e GitHub deposunu bağla, **Environment Variables** kısmına `.env.local` içindeki iki değeri ekle, alan adını bağla.

---

## Geliştirici notları

- **Next.js 16** (App Router, `src/proxy.ts` = eski middleware), **Tailwind 4** (tema: `src/app/globals.css`), **Motion**, **Supabase** (`@supabase/ssr`).
- Ziyaretçi sayfaları `getPublicClient()` ile oturumsuz okur; `connection()` sayesinde her istekte günceldir.
- Güvenlik veritabanında: tüm tablolarda RLS açık. Ziyaretçi yalnızca yayındaki içeriği okur ve form gönderebilir; yazma/okuma yetkisi `public.is_admin()` ile yöneticilerde.
- Formlar sunucu eylemiyle gönderilir (`src/app/(site)/actions.ts`): zod doğrulaması + bot tuzağı.

### Panele yeni bölüm eklemek

1. `supabase/migrations/` altına yeni SQL dosyası (tablo + RLS; `0001_temel.sql`'deki döngüleri örnek al)
   ve [`scripts/check-sql.mjs`](scripts/check-sql.mjs)'e o fazın güvenlik testlerini ekle.
2. [`src/lib/admin/resources.ts`](src/lib/admin/resources.ts)'e bir kayıt ekle (alanlar, liste sütunları).
   Liste / ekle / düzenle / sil ekranları otomatik oluşur, kenar menüde görünür.
3. Sitedeki sayfayı `src/app/(site)/` altında yaz, menüye [`src/lib/nav.ts`](src/lib/nav.ts)'ten ekle.

Site ayarına yeni alan: `SiteSettings` tipi ([`src/lib/settings.ts`](src/lib/settings.ts)) + [`settings-schema.ts`](src/lib/admin/settings-schema.ts).

### Komutlar

```bash
npm run dev      # geliştirme sunucusu
npm run build    # üretim derlemesi
npm run lint     # ESLint
npm run check:sql  # SQL göçlerini + güvenlik kurallarını Supabase'siz test eder (PGlite)
npm run check:live # canlı Supabase izinlerini ziyaretçi gözüyle kontrol eder (veri yazmaz)
npx prettier --write "src/**/*.{ts,tsx,css}"
```
