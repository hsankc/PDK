import { z } from "zod";

export type FormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string>;
};

export const initialFormState: FormState = { status: "idle" };

/** Boş metni null yapar, fazla boşlukları temizler. */
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `En fazla ${max} karakter olabilir.`)
    .transform((value) => value || null);

export const membershipSchema = z.object({
  full_name: z.string().trim().min(2, "Adını ve soyadını yaz.").max(120),
  email: z.email("Geçerli bir e-posta adresi yaz.").trim().max(200),
  phone: optionalText(30),
  student_no: optionalText(30),
  department: optionalText(150),
  grade: optionalText(30),
  interests: optionalText(1000),
  message: optionalText(3000),
});

export const suggestionSchema = z.object({
  kind: z.enum(["istek", "oneri", "sikayet", "tesekkur"]),
  name: optionalText(120),
  email: z.union([z.literal(""), z.email("Geçerli bir e-posta adresi yaz.")]).transform((value) => value || null),
  message: z.string().trim().min(3, "Mesajını yaz.").max(5000, "Mesaj en fazla 5000 karakter olabilir."),
});

export const adoptionSchema = z.object({
  adoption_id: z.uuid("İlan bulunamadı."),
  full_name: z.string().trim().min(2, "Adını ve soyadını yaz.").max(120),
  phone: z.string().trim().min(7, "Telefon numaranı yaz.").max(30, "Telefon numarası çok uzun."),
  email: z.union([z.literal(""), z.email("Geçerli bir e-posta adresi yaz.")]).transform((value) => value || null),
  city: optionalText(120),
  housing: z
    .union([z.literal(""), z.enum(["apartman", "bahceli", "yurt", "diger"])])
    .transform((value) => value || null),
  other_pets: optionalText(500),
  experience: optionalText(2000),
  message: optionalText(3000),
});

export function formDataToObject(formData: FormData, keys: string[]) {
  return Object.fromEntries(keys.map((key) => [key, String(formData.get(key) ?? "")]));
}

export function zodErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "");
    if (key && !errors[key]) errors[key] = issue.message;
  }
  return errors;
}

/** Botlar gizli alanı doldurur; insanlar görmez. */
export function isBot(formData: FormData) {
  return Boolean(String(formData.get("website") ?? "").trim());
}
