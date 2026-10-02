"use client";

import { submitLostFoundReport } from "@/app/(site)/actions";
import { speciesOptions } from "@/lib/options";
import { ActionForm, TextArea, TextInput } from "./FormKit";

export function LostFoundForm() {
  return (
    <ActionForm
      action={submitLostFoundReport}
      submitLabel="Bildirimi gönder"
      successTitle="Bildirimin bize ulaştı!"
      successText="Ekibimiz bilgileri kontrol edip ilanı en kısa sürede yayınlayacak. Gerekirse seni arayacağız."
      againLabel="Yeni bildirim yap"
    >
      {(errors) => (
        <>
          <fieldset>
            <legend className="field-label">
              Ne oldu? <span className="text-brand">*</span>
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { value: "kayip", title: "Dostum kayboldu", text: "Kendi kedin/köpeğin ya da bildiğin bir dost." },
                { value: "bulundu", title: "Bir dost buldum", text: "Sahipli görünen, kaybolmuş bir hayvan." },
              ].map((option, index) => (
                <label key={option.value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="kind"
                    value={option.value}
                    defaultChecked={index === 0}
                    className="peer sr-only"
                  />
                  <span className="border-ink/30 peer-checked:border-ink peer-checked:bg-brand-soft peer-checked:shadow-hard-sm peer-focus-visible:shadow-hard-red block rounded-2xl border-2 p-4 transition-all">
                    <span className="font-display block text-lg font-extrabold">{option.title}</span>
                    <span className="text-ink-soft text-sm">{option.text}</span>
                  </span>
                </label>
              ))}
            </div>
            {errors.kind && <p className="text-brand mt-1 text-sm font-bold">{errors.kind}</p>}
          </fieldset>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="f-species" className="field-label">
                Hayvan
              </label>
              <select id="f-species" name="species" defaultValue="kedi" className="field-input">
                {speciesOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <TextInput name="animal_name" label="Adı" help="Biliyorsan." error={errors.animal_name} />
            <TextInput name="area" label="Nerede?" placeholder="Örn: Kampüs girişi, Kordon" error={errors.area} />
            <TextInput name="seen_on" label="Ne zaman?" type="date" error={errors.seen_on} />
          </div>

          <TextArea
            name="description"
            label="Hayvanı anlat"
            required
            rows={4}
            placeholder="Rengi, cinsiyeti, tasması, huyları, belirgin işaretleri…"
            error={errors.description}
          />
          <TextInput
            name="photo_link"
            label="Fotoğraf bağlantısı"
            type="url"
            placeholder="https://"
            help="Instagram gönderisi, Google Drive ya da başka bir yerdeki fotoğrafın bağlantısı."
            error={errors.photo_link}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <TextInput name="contact_name" label="Adın" required autoComplete="name" error={errors.contact_name} />
            <TextInput
              name="contact_phone"
              label="Telefonun"
              type="tel"
              required
              autoComplete="tel"
              inputMode="tel"
              placeholder="05xx xxx xx xx"
              error={errors.contact_phone}
            />
            <TextInput
              name="contact_email"
              label="E-posta"
              type="email"
              autoComplete="email"
              inputMode="email"
              className="sm:col-span-2"
              error={errors.contact_email}
            />
          </div>

          <label className="text-ink-soft flex items-start gap-3 text-sm">
            <input type="checkbox" name="consent" required className="accent-brand mt-0.5 size-5 shrink-0" />
            <span>
              Bilgilerimin kulüp ekibiyle paylaşılmasını ve ilan yayınlanırsa adımın ile telefonumun ilanda görünmesini
              kabul ediyorum. <span className="text-brand">*</span>
              {errors.consent && <span className="text-brand block font-bold">{errors.consent}</span>}
            </span>
          </label>
        </>
      )}
    </ActionForm>
  );
}
