"use client";

import { submitSuggestion } from "@/app/(site)/actions";
import { suggestionKinds } from "@/lib/admin/resources";
import { ActionForm, TextArea, TextInput } from "./FormKit";

export function SuggestionForm() {
  return (
    <ActionForm
      action={submitSuggestion}
      submitLabel="Gönder"
      successTitle="Mesajın ulaştı!"
      successText="Yazdığın için teşekkürler. Ekibimiz her mesajı tek tek okuyor."
      againLabel="Yeni mesaj yaz"
    >
      {(errors) => (
        <>
          <fieldset>
            <legend className="field-label">Ne göndermek istiyorsun?</legend>
            <div className="flex flex-wrap gap-2">
              {suggestionKinds.map((kind, index) => (
                <label key={kind.value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="kind"
                    value={kind.value}
                    defaultChecked={index === 1}
                    className="peer sr-only"
                  />
                  <span className="sticker peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:shadow-hard-red transition-colors">
                    {kind.label}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <TextArea name="message" label="Mesajın" required rows={6} error={errors.message} />

          <div className="grid gap-5 sm:grid-cols-2">
            <TextInput
              name="name"
              label="Adın"
              autoComplete="name"
              help="İsimsiz göndermek için boş bırak."
              error={errors.name}
            />
            <TextInput
              name="email"
              label="E-posta"
              type="email"
              autoComplete="email"
              inputMode="email"
              help="Dönüş yapmamızı istersen yaz."
              error={errors.email}
            />
          </div>
        </>
      )}
    </ActionForm>
  );
}
