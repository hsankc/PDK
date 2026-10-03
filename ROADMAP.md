# Patili Dostlar Kulübü — Yol Haritası

**Teknoloji:** Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Motion (animasyon) · Supabase (veritabanı, giriş, dosya depolama)
**Renkler:** Türk kırmızısı `#E30A17` · Siyah `#0A0A0A` · Beyaz `#FFFFFF`
**Temel kural:** Sitedeki her yazı, resim ve liste yönetim panelinden (`/yonetim`) değiştirilebilir. Kodda sabit içerik yok.

Durum işaretleri: ✅ bitti · 🚧 sürüyor · ⏳ sırada

---

## 📌 Kaldığımız yer (03.10.2026)

- **Bitti:** Faz 0–5 (yayına alma hariç). Supabase bağlı, `0001`–`0006` çalıştırıldı, `npm run check:live` yeşil.
- **Lighthouse (mobil, üretim derlemesi):** performans 85–89, erişilebilirlik / en iyi uygulamalar / SEO 100.
- **Instagram'ın tamamı aktarıldı** (@patilidostlar_kulubu, 2022–2026, 218 paylaşım):
  - İlk tur: site ayarları, logo, Hakkımızda, 3 Ekim okey, Müjgan, PatiZone, 4 rehber, 5 yazı.
  - İkinci tur: 49 geçmiş etkinlik (duyuru + fotoğraflar birleştirildi) + 13–14 Ekim stant günleri, 29 "Biliyor musun?" bilgisi,
    19 kampüs dostu, 56 galeri fotoğrafı, 16 tarihçe maddesi, 32 destekçi, 4 kurtarma hikâyesi
    (Dori, Teoman, Rocky, Tahin), 8 rehber, 1 yazı (6 Şubat), Pati Operasyonu projesi,
    6 harita noktası, sayaçlar ve harita merkezi.
  - Eski sahiplendirme ilanları (4 adet) **gizli taslak** olarak eklendi; güncelse Nehir yayına alır.
  - Saati bilinmeyen etkinliklere tahmini saat yazıldı (çoğu 12:00–14:00); Nehir düzeltebilir.
  - Atlananlar: anma/bayram kutlamaları, çekiliş ve etkileşim paylaşımları, iptal edilen etkinlik.
- **Panel uçtan uca test edildi:** giriş, kaydetme, düzenleme, resim yükleme (tekli/çoklu/editör içi), 5 form,
  gelen kutusu (durum + not, otomatik "okundu"), bildirimi ilana çevirme, silme.
- **TEST kayıtları silindi** (03.10.2026, panelin silme düğmesiyle; silme de böylece test edildi).
- **Nehir'in doldurması gerekenler:**
  - Ekip, anlaşmalı veterinerler.
  - IBAN, borçlar ve ihtiyaç listesi.
  - Misyon/vizyon, iletişim bilgileri.
  - Pati Operasyonu'nun ilerleme yüzdesi (şimdilik %0).
  - Logoyu yüksek çözünürlüklü orijinal dosyayla değiştirmek (Instagram'daki 150 px).
- **Kontrol edilecek:**
  - Müjgan hâlâ yuva arıyor mu (Ağustos paylaşımı)?
  - Kampüs kedilerinde Nurcan (Sultanlar) ile Necla (Manifest) aynı kedi mi?
- **Sıradaki iş:** Yayına alma (Vercel + alan adı), README → "Yayına alma".
- **Bekleyenler:**
  - Nehir'in hesabı açılıp yönetici yapılacak.
  - Nehir'e sorulacak:
    - Besleme noktalarının tam konumu herkese açık mı olsun?
    - "Kısırlaştırma takevi" = takvim + takip diye yapıldı; doğru mu?
  - Kod GitHub'da: https://github.com/hsankc/PDK (`main`).

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

## Faz 4 — İçerik ve Rehberler ✅

- [x] Yazı köşesi: Word benzeri editör (başlık, kalın, liste, alıntı, bağlantı, resim), kategori, okuma süresi, paylaş düğmeleri
- [x] Rehberler ("Nasıl Yardım Ederim?"): numaralı rehber listesi, aynı editör
- [x] Web adresleri başlıktan otomatik (Türkçe harfler dönüştürülür)
- [x] Kayıp & Bulundu: ilan panosu (kayıplar / sahibi aranıyor / kavuşanlar) + ziyaretçi bildirim formu
- [x] Panelde bildirimi tek tıkla taslak ilana çevirme
- [x] Gönüllü ol & geçici yuva başvuru formu
- [x] Güvenlik: yazılar HTML değil JSON olarak saklanır; zararlı bağlantı/resim sitede çizilmez

## Arşiv Bölümleri (Instagram aktarımıyla eklendi) ✅

- [x] Etkinlik arşivi: geçmiş etkinlikler yıllara göre, her etkinliğe fotoğraf galerisi ve detay sayfası
- [x] Kampüs Kedileri: lakap, burç, en sevdiği köşe, karakter, fotoğraflar
- [x] Biliyor musun?: çevrilen bilgi kartları, konu filtresi, karıştır; ana sayfada "Günün bilgisi"
- [x] Pati Galerisi: taşlı duvar, albüm filtresi, tam ekran görüntüleyici
- [x] Tarihçe: Hakkımızda sayfasında zaman çizelgesi
- [x] Destekçilerimiz: kurum, dernek, kulüp, işletme ve sponsorlar
- [x] Menüde "Keşfet" açılır menüsü

## Faz 5 — Eğlence ve Cila 🚧

- [x] Pati Oyunları (`/oyunlar`): Mama Yakala (zararlı yiyeceklerden kaç), kampüs kedileriyle Hafıza Kartları
- [x] Skor tablosu (`0006_oyunlar.sql`); uygunsuz isimler panelden gizlenir/silinir
- [x] Gizli pati avı: 7 sayfa başlığına saklı pati, ilerleme kartı, hepsini bulana panelden yazılan mesaj
- [x] Karanlık mod (cihaz temasına uyar, menüdeki düğmeyle değişir; harita da kararır)
- [x] SEO: paylaşım görseli, site haritası, robots.txt, manifest, kulüp ve etkinlik yapılandırılmış verisi
- [x] Erişilebilirlik ve performans: içeriğe atla bağlantısı, odak halkası, "hareketi azalt" desteği,
      ilk görüntünün JS beklemeden çizilmesi, ilk ilan fotoğraflarının öncelikli yüklenmesi
- [x] KVKK aydınlatma metni (`/kvkk`, panelden düzenlenebilir), form onaylarında bağlantı,
      panelde 1 yıldan eski başvurular için hatırlatma + temizleme düğmesi
- [x] Supabase'in uyumaması için günlük Vercel zamanlayıcısı (`/api/keep-alive`)
- [ ] Yayına alma: Vercel + alan adı (README → "Yayına alma")

---

## Supabase

- Her yeni fazın SQL dosyası önce `npm run check:sql` ile bilgisayarda (PGlite) test edilir,
  sonra Supabase SQL Editor'de çalıştırılır.
- Canlı veritabanının izinleri `npm run check:live` ile ziyaretçi gözüyle kontrol edilir (veri yazmaz).

## Kurulum

Ayrıntılar: [README.md](README.md)
