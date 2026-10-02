"use client";

import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function DeleteButton({
  table,
  id,
  redirectTo,
  confirmText,
}: {
  table: string;
  id: string;
  redirectTo: string;
  confirmText: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const onDelete = async () => {
    if (!window.confirm(confirmText)) return;
    setPending(true);
    const { error } = await createClient().from(table).delete().eq("id", id);
    if (error) {
      setPending(false);
      window.alert(`Silinemedi: ${error.message}`);
      return;
    }
    router.push(redirectTo);
    router.refresh();
  };

  return (
    <button type="button" onClick={onDelete} disabled={pending} className="btn btn-white btn-sm text-brand ml-auto">
      {pending ? (
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      ) : (
        <Trash2 className="size-4" aria-hidden="true" />
      )}
      Sil
    </button>
  );
}
