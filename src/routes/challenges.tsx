import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Trophy, Clock, Users } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/lib/app-store";
import { CHALLENGES } from "@/lib/data";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/challenges")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { title: "التحديات | AI Magic City" },
      { name: "description", content: "شارك في تحديات الذكاء الاصطناعي الأسبوعية واكسب نقاط XP." },
      { property: "og:title", content: "تحديات الذكاء الاصطناعي" },
      { property: "og:description", content: "تحديات أسبوعية ونقاط XP." },
    ],
  }),
  component: Challenges,
});

function Challenges() {
  const { t, tr } = useApp();
  const [joined, setJoined] = useState<string[]>([]);
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-3xl font-black">{tr("التحديات", "Challenges")}</h1>
      {CHALLENGES.map((c) => (
        <div key={c.id} className="flex flex-wrap items-center gap-4 rounded-2xl border bg-card p-5">
          <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-gold text-primary-foreground"><Trophy /></div>
          <div className="min-w-0 flex-1">
            <div className="font-bold">{t(c.title)}</div>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="size-3.5" />{c.days} {tr("أيام", "days")}</span>
              <span className="flex items-center gap-1"><Users className="size-3.5" />{c.joined + (joined.includes(c.id) ? 1 : 0)}</span>
            </div>
          </div>
          <span className="font-bold text-primary">+{c.xp} XP</span>
          <Button size="sm" disabled={joined.includes(c.id)} onClick={() => { setJoined([...joined, c.id]); toast.success(tr("انضممت للتحدي!", "Joined the challenge!")); }}>
            {joined.includes(c.id) ? tr("مشترك", "Joined") : tr("شارك", "Join")}
          </Button>
        </div>
      ))}
    </div>
  );
}
