"use client";

import { submitAdoption } from "@/app/(site)/actions";
import { housingOptions } from "@/lib/options";
import { ActionForm, TextArea, TextInput } from "./FormKit";

export function AdoptionForm({ adoptionId, animalName }: { adoptionId: string; animalName: string }) {
  return (
    <ActionForm
      action={submitAdoption}
      submitLabel="Başvurumu gönder"
      successTitle="Başvurun bize ulaştı!"
      successText={`${animalName} için gösterdiğin ilgiye çok teşekkürler. Ekibimiz seninle telefonla iletişime geçecek.`}
      againLabel="Yeni başvuru yap"
    >
      {(errors) => (
        <>
          <input type="hidden" name="adoption_id" value={adoptionId} />
          <div className="grid gap-5 sm:grid-cols-2">
            <TextInput name="full_name" label="Ad Soyad" required autoComplete="name" error={errors.full_name} />
            <TextInput
              name="phone"
              label="Telefon"
              type="tel"
              required
              autoComplete="tel"
              inputMode="tel"
              placeholder="05xx xxx xx xx"
              error={errors.phone}
            />
            <TextInput
              name="email"
              label="E-posta"
              type="email"
              autoComplete="email"
              inputMode="email"
              error={errors.email}
            />
            <TextInput name="city" label="Şehir / semt" autoComplete="address-level2" error={errors.city} />
            <div className="sm:col-span-2">
              <label htmlFor="f-housing" className="field-label">
                Nerede yaşıyorsun?
              </label>
              <select id="f-housing" name="housing" defaultValue="" className="field-input">
                <option value="">Seç</option>
                {housingOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <TextArea
            name="other_pets"
            label="Evde başka hayvan var mı?"
            rows={2}
            placeholder="Örn: 3 yaşında kısır bir kedim var."
            error={errors.other_pets}
          />
          <TextArea name="experience" label="Daha önce hayvan baktın mı?" rows={3} error={errors.experience} />
          <TextArea
            name="message"
            label={`${animalName} hakkında eklemek istediklerin`}
            rows={3}
            error={errors.message}
          />

          <label className="text-ink-soft flex items-start gap-3 text-sm">
            <input type="checkbox" name="consent" required className="accent-brand mt-0.5 size-5 shrink-0" />
            <span>
              Sahiplendirme şartlarını okudum. Kişisel verilerimin yalnızca bu başvuru kapsamında işlenmesini kabul
              ediyorum. <span className="text-brand">*</span>
              {errors.consent && <span className="text-brand block font-bold">{errors.consent}</span>}
            </span>
          </label>
        </>
      )}
    </ActionForm>
  );
}
