import type { Option } from "@/lib/admin/types";

/** Veritabanındaki kısa değerlerin sitede görünen karşılıkları (hem panel hem site kullanır). */

export const speciesOptions: Option[] = [
  { value: "kedi", label: "Kedi" },
  { value: "kopek", label: "Köpek" },
  { value: "diger", label: "Diğer" },
];

export const sexOptions: Option[] = [
  { value: "disi", label: "Dişi" },
  { value: "erkek", label: "Erkek" },
];

export const ageGroupOptions: Option[] = [
  { value: "yavru", label: "Yavru" },
  { value: "genc", label: "Genç" },
  { value: "yetiskin", label: "Yetişkin" },
  { value: "yasli", label: "Yaşlı" },
];

export const adoptionStatusOptions: Option[] = [
  { value: "sahiplendirilebilir", label: "Yuva arıyor" },
  { value: "rezerve", label: "Rezerve" },
  { value: "sahiplendirildi", label: "Yuvasını buldu" },
];

export const adoptionApplicationStatuses: Option[] = [
  { value: "yeni", label: "Yeni" },
  { value: "inceleniyor", label: "İnceleniyor" },
  { value: "onaylandi", label: "Onaylandı" },
  { value: "red", label: "Reddedildi" },
];

export const housingOptions: Option[] = [
  { value: "apartman", label: "Apartman dairesi" },
  { value: "bahceli", label: "Bahçeli ev" },
  { value: "yurt", label: "Yurt / öğrenci evi" },
  { value: "diger", label: "Diğer" },
];

export const shelterKindOptions: Option[] = [
  { value: "besleme", label: "Mama noktası" },
  { value: "su", label: "Su kabı" },
  { value: "kulube", label: "Kulübe" },
  { value: "yuva", label: "Yuva / barınak" },
  { value: "diger", label: "Diğer" },
];

export const projectStatusOptions: Option[] = [
  { value: "planlaniyor", label: "Planlanıyor" },
  { value: "devam", label: "Devam ediyor" },
  { value: "tamamlandi", label: "Tamamlandı" },
];

export const neuterStatusOptions: Option[] = [
  { value: "planlandi", label: "Planlandı" },
  { value: "yapildi", label: "Yapıldı" },
  { value: "iptal", label: "İptal" },
];

export const lostFoundKindOptions: Option[] = [
  { value: "kayip", label: "Kayıp" },
  { value: "bulundu", label: "Bulundu" },
];

export const lostFoundStatusOptions: Option[] = [
  { value: "aktif", label: "Aranıyor / sahibi aranıyor" },
  { value: "kavustu", label: "Kavuştu" },
];

export const lostFoundReportStatuses: Option[] = [
  { value: "yeni", label: "Yeni" },
  { value: "yayinlandi", label: "İlana dönüştürüldü" },
  { value: "kapandi", label: "Kapandı" },
];

export const volunteerKindOptions: Option[] = [
  { value: "gonullu", label: "Gönüllü" },
  { value: "gecici_yuva", label: "Geçici yuva" },
];

export const volunteerStatuses: Option[] = [
  { value: "yeni", label: "Yeni" },
  { value: "inceleniyor", label: "İnceleniyor" },
  { value: "kabul", label: "Kabul edildi" },
  { value: "red", label: "Reddedildi" },
];

export const factCategoryOptions: Option[] = [
  { value: "kedi", label: "Kediler" },
  { value: "kopek", label: "Köpekler" },
  { value: "genel", label: "Genel" },
];

export const partnerKindOptions: Option[] = [
  { value: "kurum", label: "Kurum" },
  { value: "dernek", label: "Dernek & gönüllü grup" },
  { value: "kulup", label: "Öğrenci kulübü" },
  { value: "isletme", label: "İşletme" },
  { value: "sponsor", label: "Sponsor" },
];

export function labelOf(options: Option[], value: unknown) {
  return options.find((option) => option.value === value)?.label ?? "";
}
