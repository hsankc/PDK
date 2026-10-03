import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { getSettings, type SiteSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni",
  description: "Kişisel verilerin korunması: hangi verileri neden topluyoruz, ne kadar saklıyoruz, haklarınız neler.",
};

type Block = { heading?: string; text: string };

/** Panelden metin girilmemişse kullanılan şablon (kulüp adı ve iletişim bilgisi ayarlardan gelir). */
function defaultText(settings: SiteSettings): Block[] {
  const club = settings.club_name;
  const owner = settings.university ? `${settings.university} bünyesindeki ${club}` : club;
  const contact = settings.email
    ? `${settings.email} adresine e-posta göndererek`
    : "Instagram hesabımızdan bize mesaj atarak ya da İstek & Öneri sayfasındaki formu kullanarak";

  return [
    {
      text: `Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında, ${owner} ("Kulüp") tarafından internet sitemizdeki formlar aracılığıyla toplanan kişisel verilerin nasıl işlendiği hakkında sizi bilgilendirmek için hazırlanmıştır.`,
    },
    {
      heading: "1. Veri sorumlusu",
      text: `Kişisel verileriniz, veri sorumlusu sıfatıyla ${owner} tarafından işlenir. Kulüp, gönüllü öğrencilerden oluşan ve kâr amacı gütmeyen bir öğrenci topluluğudur.`,
    },
    {
      heading: "2. Hangi verileri topluyoruz?",
      text: `Yalnızca doldurduğunuz formda istenen bilgileri alırız:
• Kulübe katılım: ad soyad, e-posta, telefon, öğrenci numarası, bölüm, sınıf, ilgi alanları ve mesajınız.
• Sahiplenme başvurusu: ad soyad, telefon, e-posta, şehir/semt, yaşadığınız yer, evdeki diğer hayvanlar, deneyiminiz ve mesajınız.
• Gönüllü ve geçici yuva başvurusu: ad soyad, telefon, e-posta, semt/yurt, yaşadığınız yer, uygun zamanlarınız ve mesajınız.
• Kayıp & bulundu bildirimi: adınız, telefonunuz, e-postanız ve hayvanla ilgili bilgiler.
• İstek & öneri: mesajınız; adınızı ve e-postanızı yazmak isteğe bağlıdır.
• Pati Oyunları: skor tablosuna yazdığınız ad ya da takma ad.`,
    },
    {
      heading: "3. Verileri hangi amaçlarla işliyoruz?",
      text: "Başvurunuzu değerlendirmek ve sizinle iletişime geçmek; sahiplendirme sürecini yürütmek ve hayvanın güvenli bir yuvaya gittiğinden emin olmak; kayıp/bulundu ilanlarını yayınlamak; gönüllü ve geçici yuva desteğini planlamak; önerilerinizi değerlendirmek ve skor tablosunu göstermek.",
    },
    {
      heading: "4. Hukuki sebep ve toplama yöntemi",
      text: "Verileriniz, internet sitemizdeki formlar aracılığıyla elektronik ortamda ve formdaki onay kutusunu işaretleyerek verdiğiniz açık rızanıza dayanarak (KVKK m. 5/1) toplanır. Kayıp/bulundu ilanlarında, onay vermeniz hâlinde adınız ve telefonunuz ilanla birlikte sitede yayınlanır.",
    },
    {
      heading: "5. Verilerin aktarılması ve saklandığı yer",
      text: "Verileriniz üçüncü kişilere satılmaz ve reklam amacıyla kullanılmaz; yalnızca başvuruyu değerlendiren kulüp yönetim ekibi tarafından görülür. Sitemiz, hizmet aldığımız Supabase (veritabanı) ve Vercel (barındırma) altyapısında çalışır; bu nedenle verileriniz yurt dışındaki sunucularda saklanabilir. Formdaki onay kutusunu işaretleyerek bu aktarıma da açık rıza vermiş olursunuz (KVKK m. 9). Sahiplendirme sürecinde, gerektiğinde ve yalnızca süreçle sınırlı olarak anlaşmalı veteriner hekimlerimizle paylaşılabilir.",
    },
    {
      heading: "6. Saklama süresi",
      text: "Başvuru ve mesajlar, değerlendirme tamamlandıktan sonra en geç 1 yıl içinde silinir. Yayındaki kayıp/bulundu ilanları, ilan kaldırıldığında silinir. Skor tablosundaki adlar, oyunlar sitede kaldığı sürece görünür; istediğiniz zaman sildirebilirsiniz.",
    },
    {
      heading: "7. Çerezler ve tarayıcı depolaması",
      text: "Sitemizde reklam ya da takip çerezi kullanılmaz. Tema tercihiniz (aydınlık/karanlık), oyunlarda yazdığınız ad ve bulduğunuz gizli patiler yalnızca kendi tarayıcınızda saklanır, bize gönderilmez. Yönetim paneline giriş için yalnızca zorunlu oturum çerezi kullanılır.",
    },
    {
      heading: "8. Haklarınız",
      text: "KVKK m. 11 uyarınca; kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme, aktarıldığı üçüncü kişileri bilme, eksik veya yanlış işlenmişse düzeltilmesini, silinmesini ya da yok edilmesini isteme, bu işlemlerin aktarıldığı kişilere bildirilmesini isteme, otomatik sistemlerle analiz sonucu aleyhinize bir sonuç çıkmasına itiraz etme ve kanuna aykırı işleme nedeniyle zarara uğramanız hâlinde zararın giderilmesini talep etme haklarına sahipsiniz. Açık rızanızı dilediğiniz zaman geri alabilirsiniz.",
    },
    {
      heading: "9. Bize ulaşın",
      text: `Haklarınızı kullanmak ya da verilerinizin silinmesini istemek için ${contact} bize ulaşabilirsiniz. Talebinizi en geç 30 gün içinde sonuçlandırırız.`,
    },
  ];
}

/** Panelde yazılan metinde "## Başlık" satırları başlık olur, boş satırlar paragrafları ayırır. */
function parseCustom(text: string): Block[] {
  return text
    .split(/\n\s*\n/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      const [first, ...rest] = chunk.split("\n");
      return first.startsWith("## ")
        ? { heading: first.slice(3).trim(), text: rest.join("\n").trim() }
        : { text: chunk };
    });
}

export default async function PrivacyPage() {
  const settings = await getSettings();
  const blocks = settings.privacy_text.trim() ? parseCustom(settings.privacy_text) : defaultText(settings);

  return (
    <>
      <PageHeader eyebrow="Kişisel verilerin korunması" title="KVKK Aydınlatma Metni" />
      <article className="mx-auto max-w-3xl space-y-6 px-4 py-16 sm:px-6">
        {blocks.map((block, index) => (
          <section key={index}>
            {block.heading && <h2 className="font-display mb-2 text-2xl font-extrabold">{block.heading}</h2>}
            {block.text && <p className="text-ink-soft text-lg leading-relaxed whitespace-pre-line">{block.text}</p>}
          </section>
        ))}
      </article>
    </>
  );
}
