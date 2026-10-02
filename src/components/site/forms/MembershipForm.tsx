"use client";

import { submitMembership } from "@/app/(site)/actions";
import { ActionForm, TextArea, TextInput } from "./FormKit";

const grades = [
  "Hazırlık",
  "1. sınıf",
  "2. sınıf",
  "3. sınıf",
  "4. sınıf",
  "5. sınıf ve üzeri",
  "Yüksek lisans",
  "Doktora",
  "Mezun",
  "Diğer",
];

export function MembershipForm() {
  return (
    <ActionForm
      action={submitMembership}
      submitLabel="Başvurumu gönder"
      successTitle="Başvurun bize ulaştı!"
      successText="Aramıza katılmak istediğin için çok teşekkürler. Ekibimiz en kısa sürede seninle iletişime geçecek."
      againLabel="Yeni başvuru yap"
    >
      {(errors) => (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <TextInput name="full_name" label="Ad Soyad" required autoComplete="name" error={errors.full_name} />
            <TextInput
              name="email"
              label="E-posta"
              type="email"
              required
              autoComplete="email"
              inputMode="email"
              error={errors.email}
            />
            <TextInput
              name="phone"
              label="Telefon"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              placeholder="05xx xxx xx xx"
              error={errors.phone}
            />
            <TextInput name="student_no" label="Öğrenci numarası" error={errors.student_no} />
            <TextInput name="department" label="Bölüm" error={errors.department} />
            <div>
              <label htmlFor="f-grade" className="field-label">
                Sınıf
              </label>
              <select id="f-grade" name="grade" defaultValue="" className="field-input">
                <option value="">Seç</option>
                {grades.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <TextArea
            name="interests"
            label="Hangi işlerde yer almak istersin?"
            rows={3}
            placeholder="Besleme, sahiplendirme, etkinlik, sosyal medya, tasarım…"
            error={errors.interests}
          />
          <TextArea name="message" label="Bize eklemek istediğin bir şey var mı?" rows={3} error={errors.message} />

          <label className="text-ink-soft flex items-start gap-3 text-sm">
            <input type="checkbox" name="consent" required className="accent-brand mt-0.5 size-5 shrink-0" />
            <span>
              Kişisel verilerimin yalnızca kulüp üyelik başvurusu kapsamında işlenmesini kabul ediyorum.{" "}
              <span className="text-brand">*</span>
              {errors.consent && <span className="text-brand block font-bold">{errors.consent}</span>}
            </span>
          </label>
        </>
      )}
    </ActionForm>
  );
}
