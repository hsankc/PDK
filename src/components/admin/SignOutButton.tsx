"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      className="btn btn-black"
      onClick={async () => {
        await createClient().auth.signOut();
        router.replace("/yonetim/giris");
        router.refresh();
      }}
    >
      <LogOut className="size-4" aria-hidden="true" /> Çıkış yap
    </button>
  );
}
