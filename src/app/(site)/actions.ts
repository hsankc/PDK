"use server";

import {
  adoptionSchema,
  formDataToObject,
  isBot,
  lostFoundReportSchema,
  membershipSchema,
  scoreSchema,
  suggestionSchema,
  volunteerSchema,
  zodErrors,
  type FormState,
} from "@/lib/forms";
import { getSettings } from "@/lib/settings";
import { getPublicClient } from "@/lib/supabase/public";

const NOT_CONFIGURED: FormState = {
  status: "error",
  message: "Site henüz veritabanına bağlanmadı. Lütfen daha sonra tekrar dene.",
};
const SAVE_FAILED: FormState = {
  status: "error",
  message: "Bir sorun oluştu, gönderilemedi. Biraz sonra tekrar dener misin?",
};

export async function submitMembership(_prev: FormState, formData: FormData): Promise<FormState> {
  if (isBot(formData)) return { status: "success" };

  const settings = await getSettings();
  if (!settings.membership_open) return { status: "error", message: "Başvurular şu an kapalı." };
  if (formData.get("consent") !== "on") {
    return {
      status: "error",
      message: "Başvuru için onay kutusunu işaretlemelisin.",
      errors: { consent: "Onay gerekli." },
    };
  }

  const parsed = membershipSchema.safeParse(
    formDataToObject(formData, [
      "full_name",
      "email",
      "phone",
      "student_no",
      "department",
      "grade",
      "interests",
      "message",
    ]),
  );
  if (!parsed.success) {
    return { status: "error", message: "Lütfen işaretli alanları kontrol et.", errors: zodErrors(parsed.error) };
  }

  const supabase = await getPublicClient();
  if (!supabase) return NOT_CONFIGURED;

  const { error } = await supabase.from("membership_applications").insert(parsed.data);
  if (error) {
    console.error("Üyelik başvurusu kaydedilemedi:", error.message);
    return SAVE_FAILED;
  }
  return { status: "success" };
}

export async function submitSuggestion(_prev: FormState, formData: FormData): Promise<FormState> {
  if (isBot(formData)) return { status: "success" };

  const parsed = suggestionSchema.safeParse(formDataToObject(formData, ["kind", "name", "email", "message"]));
  if (!parsed.success) {
    return { status: "error", message: "Lütfen işaretli alanları kontrol et.", errors: zodErrors(parsed.error) };
  }

  const supabase = await getPublicClient();
  if (!supabase) return NOT_CONFIGURED;

  const { error } = await supabase.from("suggestions").insert(parsed.data);
  if (error) {
    console.error("Öneri kaydedilemedi:", error.message);
    return SAVE_FAILED;
  }
  return { status: "success" };
}

export async function submitAdoption(_prev: FormState, formData: FormData): Promise<FormState> {
  if (isBot(formData)) return { status: "success" };
  if (formData.get("consent") !== "on") {
    return {
      status: "error",
      message: "Başvuru için onay kutusunu işaretlemelisin.",
      errors: { consent: "Onay gerekli." },
    };
  }

  const parsed = adoptionSchema.safeParse(
    formDataToObject(formData, [
      "adoption_id",
      "full_name",
      "phone",
      "email",
      "city",
      "housing",
      "other_pets",
      "experience",
      "message",
    ]),
  );
  if (!parsed.success) {
    return { status: "error", message: "Lütfen işaretli alanları kontrol et.", errors: zodErrors(parsed.error) };
  }

  const supabase = await getPublicClient();
  if (!supabase) return NOT_CONFIGURED;

  // İlan hâlâ yayında ve yuva arıyor mu?
  const { data: animal } = await supabase
    .from("adoptions")
    .select("name, status")
    .eq("id", parsed.data.adoption_id)
    .eq("is_published", true)
    .maybeSingle();
  if (!animal) return { status: "error", message: "Bu ilan artık yayında değil." };
  if (animal.status !== "sahiplendirilebilir") {
    return { status: "error", message: "Bu dostumuz için şu an başvuru alınmıyor." };
  }

  const { error } = await supabase.from("adoption_applications").insert({ ...parsed.data, animal_name: animal.name });
  if (error) {
    console.error("Sahiplenme başvurusu kaydedilemedi:", error.message);
    return SAVE_FAILED;
  }
  return { status: "success" };
}

export async function submitLostFoundReport(_prev: FormState, formData: FormData): Promise<FormState> {
  if (isBot(formData)) return { status: "success" };
  if (formData.get("consent") !== "on") {
    return { status: "error", message: "Onay kutusunu işaretlemelisin.", errors: { consent: "Onay gerekli." } };
  }

  const parsed = lostFoundReportSchema.safeParse(
    formDataToObject(formData, [
      "kind",
      "species",
      "animal_name",
      "description",
      "area",
      "seen_on",
      "photo_link",
      "contact_name",
      "contact_phone",
      "contact_email",
    ]),
  );
  if (!parsed.success) {
    return { status: "error", message: "Lütfen işaretli alanları kontrol et.", errors: zodErrors(parsed.error) };
  }

  const supabase = await getPublicClient();
  if (!supabase) return NOT_CONFIGURED;
  const { error } = await supabase.from("lost_found_reports").insert(parsed.data);
  if (error) {
    console.error("Kayıp/bulundu bildirimi kaydedilemedi:", error.message);
    return SAVE_FAILED;
  }
  return { status: "success" };
}

export async function submitVolunteer(_prev: FormState, formData: FormData): Promise<FormState> {
  if (isBot(formData)) return { status: "success" };

  const settings = await getSettings();
  if (!settings.volunteer_open) return { status: "error", message: "Başvurular şu an kapalı." };
  if (formData.get("consent") !== "on") {
    return { status: "error", message: "Onay kutusunu işaretlemelisin.", errors: { consent: "Onay gerekli." } };
  }

  const parsed = volunteerSchema.safeParse(
    formDataToObject(formData, [
      "kind",
      "full_name",
      "phone",
      "email",
      "district",
      "availability",
      "housing",
      "other_pets",
      "can_host",
      "duration",
      "message",
    ]),
  );
  if (!parsed.success) {
    return { status: "error", message: "Lütfen işaretli alanları kontrol et.", errors: zodErrors(parsed.error) };
  }

  const supabase = await getPublicClient();
  if (!supabase) return NOT_CONFIGURED;
  const { error } = await supabase.from("volunteer_applications").insert(parsed.data);
  if (error) {
    console.error("Gönüllü başvurusu kaydedilemedi:", error.message);
    return SAVE_FAILED;
  }
  return { status: "success" };
}

export async function submitScore(_prev: FormState, formData: FormData): Promise<FormState> {
  if (isBot(formData)) return { status: "success" };

  const parsed = scoreSchema.safeParse(formDataToObject(formData, ["game", "player_name", "score", "seconds"]));
  if (!parsed.success) {
    return { status: "error", message: "Lütfen adını kontrol et.", errors: zodErrors(parsed.error) };
  }

  const supabase = await getPublicClient();
  if (!supabase) return NOT_CONFIGURED;

  const { error } = await supabase.from("game_scores").insert(parsed.data);
  if (error) {
    console.error("Skor kaydedilemedi:", error.message);
    return SAVE_FAILED;
  }
  return { status: "success" };
}
