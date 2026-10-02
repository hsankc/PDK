"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { submitVolunteer } from "@/app/(site)/actions";
import { housingOptions } from "@/lib/options";
import { ActionForm, TextArea, TextInput } from "./FormKit";

type Kind = "gonullu" | "gecici_yuva";

const KINDS: { value: Kind; title: string; text: string }[] = [
  {
    value: "gonullu",
    title: "Gönüllü olmak istiyorum",
    text: "Besleme, etkinlik, veteriner taşıma, sosyal medya… Elinden ne gelirse.",
  },
  {
    value: "gecici_yuva",
    title: "Geçici yuva olabilirim",
    text: "Tedavisi süren ya da yuva bekleyen bir dostu bir süre evimde misafir edebilirim.",
  },
];

export function VolunteerForm({ initialKind = "gonullu" }: { initialKind?: Kind }) {
  const [kind, setKind] = useState<Kind>(initialKind);

  return (
    <ActionForm
      action={submitVolunteer}
      submitLabel="Başvurumu gönder"
      successTitle="Başvurun bize ulaştı!"
      successText="Destek olmak istediğin için çok teşekkürler. Ekibimiz seninle telefonla iletişime geçecek."
      againLabel="Yeni başvuru yap"
    >
      {(errors) => (
        <>
          <fieldset>
            <legend className="field-label">
              Nasıl destek olmak istersin? <span className="text-brand">*</span>
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {KINDS.map((option) => (
                <label key={option.value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="kind"
                    value={option.value}
                    checked={kind === option.value}
                    onChange={() => setKind(option.value)}
                    className="peer sr-only"
                  />
                  <span className="border-ink/30 peer-checked:border-ink peer-checked:bg-brand-soft peer-checked:shadow-hard-sm peer-focus-visible:shadow-hard-red block h-full rounded-2xl border-2 p-4 transition-all">
                    <span className="font-display block text-lg font-extrabold">{option.title}</span>
                    <span className="text-ink-soft text-sm">{option.text}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

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
            <TextInput name="district" label="Semt / yurt" error={errors.district} />
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {kind === "gonullu" ? (
              <motion.div
                key="gonullu"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <TextArea
                  name="availability"
                  label="Hangi işlerde, hangi zamanlarda yardım edebilirsin?"
                  rows={3}
                  placeholder="Örn: Hafta içi akşamları besleme, hafta sonu etkinlik…"
                  error={errors.availability}
                />
              </motion.div>
            ) : (
              <motion.div
                key="gecici"
                className="grid gap-5 sm:grid-cols-2"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <div>
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
                <TextInput
                  name="can_host"
                  label="Kimi misafir edebilirsin?"
                  placeholder="Örn: Yavru kedi, yetişkin köpek"
                  error={errors.can_host}
                />
                <TextInput
                  name="duration"
                  label="Ne kadar süre?"
                  placeholder="Örn: 2 hafta, dönem boyunca"
                  error={errors.duration}
                />
                <TextInput
                  name="other_pets"
                  label="Evde başka hayvan var mı?"
                  placeholder="Varsa yaz"
                  error={errors.other_pets}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <TextArea name="message" label="Eklemek istediğin bir şey var mı?" rows={3} error={errors.message} />

          <label className="text-ink-soft flex items-start gap-3 text-sm">
            <input type="checkbox" name="consent" required className="accent-brand mt-0.5 size-5 shrink-0" />
            <span>
              Kişisel verilerimin yalnızca bu başvuru kapsamında işlenmesini kabul ediyorum.{" "}
              <span className="text-brand">*</span>
              {errors.consent && <span className="text-brand block font-bold">{errors.consent}</span>}
            </span>
          </label>
        </>
      )}
    </ActionForm>
  );
}
