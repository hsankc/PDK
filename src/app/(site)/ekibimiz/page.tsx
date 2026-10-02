import type { Metadata } from "next";
import { EmptyState } from "@/components/site/EmptyState";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { TeamCard } from "@/components/site/TeamCard";
import { getTeamMembers } from "@/lib/data";

export const metadata: Metadata = { title: "Ekibimiz" };

export default async function TeamPage() {
  const team = await getTeamMembers();

  return (
    <>
      <PageHeader eyebrow="Yönetim kurulu" title="Ekibimiz">
        Kulübü ayakta tutan, patili dostlarımız için koşturan ekip.
      </PageHeader>

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        {team.length === 0 ? (
          <EmptyState title="Ekip tanıtımı yakında">Ekip üyelerimiz çok yakında burada olacak.</EmptyState>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member, index) => (
              <Reveal key={member.id} delay={(index % 3) * 0.08}>
                <TeamCard member={member} index={index} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
