import { Trophy } from "lucide-react";
import type { Game, GameScore } from "@/lib/data";

const medals = ["🥇", "🥈", "🥉"];

export function Leaderboard({ game, rows }: { game: Game; rows: GameScore[] }) {
  return (
    <div className="card p-5 sm:p-6">
      <h3 className="font-display flex items-center gap-2 text-2xl font-extrabold">
        <Trophy className="text-brand size-6" aria-hidden="true" /> Skor tablosu
      </h3>
      <p className="text-ink-soft mb-4 text-sm font-bold">
        {game === "mama" ? "En çok puan toplayanlar" : "En az hamlede bitirenler"}
      </p>
      {rows.length === 0 ? (
        <p className="text-ink-soft py-6 text-center font-bold">Henüz skor yok. İlk sen yaz! 🐾</p>
      ) : (
        <ol className="space-y-1.5">
          {rows.map((row, index) => (
            <li
              key={row.id}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 ${index < 3 ? "bg-mist font-bold" : ""}`}
            >
              <span className="w-7 shrink-0 text-center text-lg" aria-label={`${index + 1}.`}>
                {medals[index] ?? <span className="text-ink-soft text-sm font-bold">{index + 1}</span>}
              </span>
              <span className="min-w-0 flex-1 truncate">{row.player_name}</span>
              <span className="font-display shrink-0 font-extrabold">
                {game === "mama" ? `${row.score} puan` : `${row.score} hamle`}
                {game === "hafiza" && row.seconds !== null && (
                  <span className="text-ink-soft font-sans text-sm font-bold"> · {row.seconds} sn</span>
                )}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
