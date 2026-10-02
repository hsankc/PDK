"use client";

import { AlertCircle, Loader2, Send } from "lucide-react";
import { motion } from "motion/react";
import { useActionState, useState, useTransition, type FormEvent, type ReactNode } from "react";
import { CatFace } from "@/components/pets/CatFace";
import { DogFace } from "@/components/pets/DogFace";
import { initialFormState, type FormState } from "@/lib/forms";

type Action = (prev: FormState, formData: FormData) => Promise<FormState>;

type ActionFormProps = {
  action: Action;
  submitLabel: string;
  successTitle: string;
  successText: string;
  againLabel: string;
  children: (errors: Record<string, string>) => ReactNode;
};

/**
 * Sunucu eylemine gönderilen form. Hata olursa yazılanlar silinmez;
 * başarılı olunca kedi-köpekli teşekkür ekranı çıkar.
 */
export function ActionForm(props: ActionFormProps) {
  const [key, setKey] = useState(0);
  return <ActionFormInner key={key} {...props} onReset={() => setKey((value) => value + 1)} />;
}

function ActionFormInner({
  action,
  submitLabel,
  successTitle,
  successText,
  againLabel,
  children,
  onReset,
}: ActionFormProps & { onReset: () => void }) {
  const [state, formAction, pending] = useActionState(action, initialFormState);
  const [, startTransition] = useTransition();

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  };

  if (state.status === "success") {
    return (
      <motion.div
        className="card flex flex-col items-center px-6 py-12 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="mb-6 flex items-end gap-2">
          <motion.div animate={{ y: [0, -14, 0] }} transition={{ duration: 0.8, repeat: 2 }}>
            <CatFace className="w-24" />
          </motion.div>
          <motion.div animate={{ y: [0, -14, 0] }} transition={{ duration: 0.8, repeat: 2, delay: 0.2 }}>
            <DogFace className="w-24" />
          </motion.div>
        </div>
        <h2 className="font-display text-3xl font-extrabold">{successTitle}</h2>
        <p className="text-ink-soft mt-2 max-w-md text-lg">{successText}</p>
        <button type="button" onClick={onReset} className="btn btn-white mt-8">
          {againLabel}
        </button>
      </motion.div>
    );
  }

  const errors = state.errors ?? {};

  return (
    // action: sayfa henüz yüklenmeden gönderilirse de doğrudan sunucuya POST edilir (veriler adres çubuğuna düşmez).
    // onSubmit: yüklendikten sonra formu biz gönderiyoruz; React'in formu sıfırlamasını engeller, yazılanlar kaybolmaz.
    <form action={formAction} onSubmit={onSubmit} noValidate className="card space-y-5 p-6 sm:p-8">
      {/* Bot tuzağı: insanlar görmez */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label>
          Web siteniz
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {children(errors)}

      {state.status === "error" && state.message && (
        <p
          role="alert"
          className="border-brand bg-brand-soft text-brand-dark flex items-start gap-2 rounded-xl border-2 px-4 py-3 font-bold"
        >
          <AlertCircle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
          {state.message}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn btn-red w-full py-3.5 text-lg sm:w-auto">
        {pending ? (
          <Loader2 className="size-5 animate-spin" aria-hidden="true" />
        ) : (
          <Send className="size-5" aria-hidden="true" />
        )}
        {pending ? "Gönderiliyor…" : submitLabel}
      </button>
    </form>
  );
}

type InputProps = {
  name: string;
  label: string;
  error?: string;
  required?: boolean;
  help?: string;
  className?: string;
};

export function TextInput({
  name,
  label,
  error,
  required,
  help,
  className,
  type = "text",
  ...rest
}: InputProps & {
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "text" | "tel" | "email" | "numeric";
}) {
  const id = `f-${name}`;
  return (
    <div className={className}>
      <label htmlFor={id} className="field-label">
        {label} {required && <span className="text-brand">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`field-input ${error ? "border-brand" : ""}`}
        {...rest}
      />
      <FieldMessage id={id} error={error} help={help} />
    </div>
  );
}

export function TextArea({
  name,
  label,
  error,
  required,
  help,
  className,
  rows = 4,
  placeholder,
}: InputProps & { rows?: number; placeholder?: string }) {
  const id = `f-${name}`;
  return (
    <div className={className}>
      <label htmlFor={id} className="field-label">
        {label} {required && <span className="text-brand">*</span>}
      </label>
      <textarea
        id={id}
        name={name}
        rows={rows}
        required={required}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`field-input resize-y ${error ? "border-brand" : ""}`}
      />
      <FieldMessage id={id} error={error} help={help} />
    </div>
  );
}

function FieldMessage({ id, error, help }: { id: string; error?: string; help?: string }) {
  if (error) {
    return (
      <p id={`${id}-error`} className="text-brand mt-1 text-sm font-bold">
        {error}
      </p>
    );
  }
  return help ? <p className="field-help">{help}</p> : null;
}
