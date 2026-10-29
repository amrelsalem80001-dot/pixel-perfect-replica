import { createFileRoute } from "@tanstack/react-router";
import { useApp } from "@/lib/app-store";
import { MEMBERS } from "@/lib/data";
import { getTier, TIERS } from "@/lib/tiers";
import { VerifiedBadge } from "@/components/shell";
import { cn } from "@/lib/utils";
import { useCloud } from "@/lib/cloud-store";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { title: "المتصدرين | AI Magic City" },
      { name: "description", content: "قائمة أكثر الأعضاء تفاعلاً ونقاط XP في مجتمع الذكاء الاصطناعي العربي." },
      { property: "og:title", content: "المتصدرين | AI Magic City" },
      { property: "og:description", content: "أعلى الأعضاء نقاطاً." },
    ],
  }),
  component: Leaderboard,
});

function Leaderboard() {
  const { tr, xp, authorXp } = useApp();
  const cloud = useCloud();
  const rows = [...cloud.platform.members].sort((a, b) => b.xp - a.xp);
  const next = TIERS.find((t) => t.min > xp);
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-3xl font-black">{tr("المتصدرين", "Leaderboard")}</h1>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {TIERS.map((t) => (
          <div key={t.id} className={cn("rounded-xl border bg-card p-3 text-center", getTier(xp).id === t.id && "border-primary glow")}>
            <div className="text-sm font-bold">{tr(t.ar, t.en)}</div>
            <div className="text-xs text-muted-foreground">{t.min}+ XP</div>
          </div>
        ))}
      </div>
      {next && <p className="text-sm text-muted-foreground">{tr(`تحتاج ${next.min - xp} XP للوصول إلى «${next.ar}»`, `${next.min - xp} XP to reach “${next.en}”`)}</p>}
      <ol className="divide-y rounded-2xl border bg-card">
        {rows.map((r, i) => (
          <li key={r.id} className={cn("flex items-center gap-3 p-4", r.id === cloud.user?.id && "bg-accent/50")}>
            <span className={cn("w-6 text-center font-black", i < 3 ? "text-gold" : "text-muted-foreground")}>{i + 1}</span>
            <div className="grid size-9 shrink-0 place-items-center rounded-full bg-muted font-bold">{r.name[0]}</div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1 truncate font-semibold">{r.name}<VerifiedBadge xp={r.xp} /></div>
              <div className="text-xs text-muted-foreground" dir="ltr">@{r.handle}</div>
            </div>
            <span className="font-bold text-primary">⚡ {r.xp}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
