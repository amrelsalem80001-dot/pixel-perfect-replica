import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare, Timer, DollarSign } from "lucide-react";
import { useApp } from "@/lib/app-store";
import { BATTLES } from "@/lib/data";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/battles")({
  head: () => ({
    meta: [
      { title: "مواجهات الذكاء الاصطناعي | AI Magic City" },
      { name: "description", content: "صوّت في مواجهات النماذج: Claude ضد GPT-4o، Midjourney ضد MiniMax والمزيد." },
      { property: "og:title", content: "مواجهات الذكاء الاصطناعي" },
      { property: "og:description", content: "قارن النماذج وصوّت للأفضل." },
    ],
  }),
  component: Battles,
});

function Battles() {
  const { t, tr, battleVotes, set } = useApp();
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="text-3xl font-black">{tr("مواجهات", "AI")} <span className="text-gold">AI</span> {tr("", "Battles")}</h1>
      {BATTLES.map((b) => {
        const my = battleVotes[b.id];
        const va = b.a.votes + (my === "a" ? 1 : 0), vb = b.b.votes + (my === "b" ? 1 : 0);
        const pa = Math.round((va / (va + vb)) * 100);
        const side = (k: "a" | "b") => {
          const m = b[k];
          return (
            <div className="flex-1 space-y-3 rounded-2xl border bg-muted/40 p-4 text-center">
              <div className="text-lg font-black">{m.name}</div>
              <div className="flex justify-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Timer className="size-3.5" />{m.latency}</span>
                <span className="flex items-center gap-1"><DollarSign className="size-3.5" />{m.price}</span>
              </div>
              <Button size="sm" className="w-full" variant={my === k ? "default" : "outline"} onClick={() => set({ battleVotes: { ...battleVotes, [b.id]: k } })}>
                {my === k ? tr("صوّتَّ ✓", "Voted ✓") : tr("صوّت", "Vote")}
              </Button>
            </div>
          );
        };
        return (
          <section key={b.id} className="space-y-4 rounded-3xl border bg-card p-5">
            <div className="text-xs font-bold text-primary">{t(b.cat)}</div>
            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              {side("a")}
              <div className="self-center font-display text-2xl font-black text-gold">VS</div>
              {side("b")}
            </div>
            <div className="space-y-1">
              <div className="flex h-3 overflow-hidden rounded-full bg-muted">
                <div className="bg-gold transition-all" style={{ width: `${pa}%` }} />
                <div className="flex-1 bg-cyber/70" />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground"><span>{pa}% · {va.toLocaleString()}</span><span>{vb.toLocaleString()} · {100 - pa}%</span></div>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground"><MessageSquare className="size-4" />{b.comments} {tr("تعليق", "comments")}</div>
          </section>
        );
      })}
    </div>
  );
}
