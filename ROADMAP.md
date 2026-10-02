# Patili Dostlar Kulübü — Yol Haritası

**Teknoloji:** Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Motion (animasyon) · Supabase (veritabanı, giriş, dosya depolama)
**Renkler:** Türk kırmızısı `#E30A17` · Siyah `#0A0A0A` · Beyaz `#FFFFFF`
**Temel kural:** Sitedeki her yazı, resim ve liste yönetim panelinden (`/yonetim`) değiştirilebilir. Kodda sabit içerik yok.

Durum işaretleri: ✅ bitti · 🚧 sürüyor · ⏳ sırada

---

## 📌 Kaldığımız yer (03.10.2026)
- **Bitti:** Faz 0, 1, 2 ve 3. Derleme, lint, tip kontrolü ve `npm run check:sql` temiz.
- **Sıradaki iş:** Faz 4: yazı köşesi (blog), rehberler (tutorial), kayıp/buldum, gönüllü/geçici yuva başvurusu.
  - Yazılar için zengin metin editörü seçilecek.
  - Yeni SQL dosyası `0004_icerik.sql`; güvenlik testleri `check-sql.mjs`'e eklenecek.
- **Bekleyenler:**
  - Supabase en sona bırakıldı. Bağlanınca panelde kaydetme, resim yükleme ve formlar uçtan uca test edilecek.
  - Nehir'e sorulacak:
    - Besleme noktalarının tam konumu herkese açık mı olsun?
    - "Kısırlaştırma takevi" = takvim + takip diye yapıldı; doğru mu?
  - Kod GitHub'da: https://github.com/hsankc/PDK (`main` dalı, Faz 0–3 gönderildi).

---

## Faz 0 — Altyapı ve Yönetim Paneli ✅
- [x] Proje kurulumu (Next.js, Tailwind, Motion, Supabase)
- [x] Tema: kırmızı/siyah/beyaz, fontlar, ortak bileşenler
- [x] Site iskeleti: üst menü, mobil menü, alt bilgi, duyuru bandı, 404 sayfası
- [x] Supabase şeması: yönetici tablosu, satır güvenliği (RLS), medya deposu
- [x] Yönetim paneli: giriş, özet ekranı, site ayarları
- [x] Genel içerik yönetimi altyapısı (her yeni bölüm tek bir ayar dosyasıyla panele eklenir)
- [x] Resim yükleme (Supabase Storage)
- [x] Animasyonlu maskotlar: köşeden bakan kedi/köpek, altta yürüyen kedi, tıklayınca pati izi (panelden kapatılabilir)

## Faz 1 — Kulübü Tanıtma ✅
- [x] Ana sayfa: giriş alanı, animasyonlu sayaçlar, yaklaşan etkinliğe geri sayım
- [x] Hakkımızda (misyon, vizyon)
- [x] Yönetim ekibi tanıtımı
- [x] Etkinlikler + etkinlik geri sayımı
- [x] Kulübe katılım başvuru formu
- [x] İstek ve öneri köşesi (isimsiz gönderilebilir)
- [x] Panel: ekip, etkinlikler, üyelik başvuruları, öneriler

## Faz 2 — Patili Dostlarımız ✅
- [x] Sahiplendirme ilanları (tür/yaş/cinsiyet filtresi, galeri, "Mutlu sonlar") + sahiplenme başvuru formu
- [x] İyileştirdiklerimiz (sürgülü önce/sonra karşılaştırma, iyileşme hikâyesi)
- [x] Anlaşmalı veterinerler (indirim, acil, telefon, yol tarifi, harita)
- [x] Yuva ve besleme noktaları haritası (Leaflet + OpenStreetMap, ücretsiz; türe göre filtre)
- [x] Panel: haritaya tıklayarak / "Konumumu kullan" / Google Maps bağlantısı yapıştırarak konum seçme
- [x] Panel: çoklu fotoğraf yükleme ve sıralama
- [x] Menüde "Kulüp" ve "Patili Dostlar" açılır menüleri

## Faz 3 — Şeffaflık ve Projeler ✅
- [x] Destek Ol sayfası: güncel borç, ödenen/kalan, animasyonlu ilerleme çubuğu, fatura fotoğrafları
- [x] Bağış kartı: IBAN kopyalama (Instagram tarayıcısı için yedek yöntemle), QR kod, alıcı ve banka
- [x] İhtiyaç listesi (acil / karşılandı işaretleri)
- [x] Projelerimiz (durum, ilerleme, galeri, detay sayfası)
- [x] Kısırlaştırma takvimi ve takibi (aylara göre takvim, son yapılanlar, toplam sayaç + eski kayıt sayısı)
- [x] Panel: veterinerden seçme (tablolar arası bağlantı), para ve tarih sütunları
- [x] Menüde "Çalışmalarımız" ve öne çıkan "Destek Ol"; ana sayfada destek çağrısı

## Faz 4 — İçerik ve Rehberler ⏳
- [ ] Yazı köşesi (blog, zengin metin editörü, kategoriler)
- [ ] Rehberler / tutorial: yaralı hayvan bulunca, yavru bulunca, besleme, kış hazırlığı…
- [ ] *(öneri)* Kayıp / buldum ilanları
- [ ] *(öneri)* Gönüllü ve geçici yuva başvurusu

## Faz 5 — Eğlence ve Cila ⏳
- [ ] Mini oyunlar: Mama Yakala, Hafıza Kartları (+ skor tablosu)
- [ ] Gizli pati avı (sayfalara saklanmış patileri bulana sürpriz)
- [ ] Karanlık mod
- [ ] SEO, paylaşım görselleri, site haritası
- [ ] Erişilebilirlik ve performans kontrolü
- [ ] Yayına alma: Vercel + alan adı

---

## Supabase bağlantısı (en sona bırakıldı)
Supabase en son bağlanacak. O zamana kadar:
- Site boş içerikle çalışır, panel "Supabase bağlantısı gerekli" ekranını gösterir.
- Her fazın SQL dosyası ve güvenlik kuralları `npm run check:sql` ile bilgisayarda (PGlite) test edilir.
- Bağlanınca yapılacak: `supabase/migrations/` altındaki dosyaları sırayla çalıştır → yönetici ekle → `.env.local` →
  panelde her bölümü uçtan uca dene (kaydet, resim yükle, formlar, başvurular).

## Kurulum
Ayrıntılar: [README.md](README.md)
