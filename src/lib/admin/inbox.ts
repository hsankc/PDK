/**
 * Formlardan gelen kayıtların tabloları. KVKK metninde 1 yıl içinde silineceğini söylüyoruz.
 * Hem sunucuda (panel ana sayfası sayar) hem tarayıcıda (temizleme düğmesi siler) kullanıldığı için
 * "use client" dosyasında değil, burada durur.
 */
export const INBOX_TABLES = [
  "membership_applications",
  "adoption_applications",
  "volunteer_applications",
  "lost_found_reports",
  "suggestions",
] as const;
