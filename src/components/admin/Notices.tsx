import { CatFace } from "@/components/pets/CatFace";
import { SignOutButton } from "./SignOutButton";

function NoticeFrame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-paws bg-mist grid min-h-screen place-items-center px-4 py-12">
      <div className="card w-full max-w-lg p-8 text-center">
        <CatFace className="mx-auto mb-5 w-24" />
        <h1 className="font-display text-2xl font-extrabold">{title}</h1>
        <div className="text-ink-soft mt-3 space-y-3">{children}</div>
      </div>
    </div>
  );
}

export function SetupNeeded() {
  return (
    <NoticeFrame title="Supabase bağlantısı gerekli">
      <p>
        Panelin çalışması için proje klasöründeki <code className="text-ink font-bold">.env.local</code> dosyasına
        Supabase adresini ve anahtarını yazın, sonra sunucuyu yeniden başlatın.
      </p>
      <p>Adım adım anlatım README dosyasında.</p>
    </NoticeFrame>
  );
}

export function NotAdmin({ email }: { email: string }) {
  return (
    <NoticeFrame title="Bu hesabın yönetici yetkisi yok">
      <p>
        <strong className="text-ink">{email}</strong> ile giriş yaptınız ama bu hesap yönetici listesinde değil.
      </p>
      <p>Site sorumlusundan hesabınızı yönetici yapmasını isteyin.</p>
      <div className="pt-3">
        <SignOutButton />
      </div>
    </NoticeFrame>
  );
}
