import { createFileRoute } from "@tanstack/react-router";
import { Bot, Workflow, Cpu, Clapperboard, Lock, Plus } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/lib/app-store";
import { COMMUNITIES } from "@/lib/data";
import { canCreateCommunity } from "@/lib/tiers";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export const Route = createFileRoute("/communities")({
  head: () => ({
    meta: [
      { title: "المجتمعات | AI Magic City" },
      { name: "description", content: "انضم لمجتمعات وكلاء الذكاء الاصطناعي، الأتمتة، النماذج، وصناعة المحتوى." },
      { property: "og:title", content: "المجتمعات | AI Magic City" },
      { property: "og:description", content: "مجتمعات الذكاء الاصطناعي العربية." },
    ],
  }),
  component: Communities,
});

const ICONS = { Bot, Workflow, Cpu, Clapperboard };

function Communities() {
  const { t, tr, xp, joined, set } = useApp();
  const allowed = canCreateCommunity(xp);
  const lockMsg = "يتطلب إنشاء مجتمع جديد جمع 50 نقطة XP على الأقل من خلال التفاعل والمشاركات";
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-black">{tr("المجتمعات", "Communities")}</h1>
        <Tooltip>
          <TooltipTrigger asChild>
            <span tabIndex={0}>
              <Button disabled={!allowed} onClick={() => toast.success(tr("قريباً: إنشاء مجتمع", "Coming soon: create community"))}>
                {allowed ? <Plus /> : <Lock />}{tr("إنشاء مجتمع جديد", "Create community")}
              </Button>
            </span>
          </TooltipTrigger>
          {!allowed && <TooltipContent className="max-w-xs">{tr(lockMsg, "Creating a community requires at least 50 XP earned through engagement and posts")}</TooltipContent>}
        </Tooltip>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {COMMUNITIES.map((c) => {
          const Icon = ICONS[c.icon as keyof typeof ICONS];
          const isJoined = joined.includes(c.id);
          return (
            <div key={c.id} className="flex flex-col gap-3 rounded-2xl border bg-card p-5 transition hover:border-primary/40">
              <div className="grid size-12 place-items-center rounded-xl bg-gold text-primary-foreground"><Icon /></div>
              <h2 className="text-lg font-bold">{t(c.name)}</h2>
              <p className="text-sm text-muted-foreground">{t(c.desc)}</p>
              <div className="mt-auto flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{(c.members + (isJoined ? 1 : 0)).toLocaleString()} {tr("عضو", "members")}</span>
                <Button size="sm" variant={isJoined ? "outline" : "default"} onClick={() => set({ joined: isJoined ? joined.filter((j) => j !== c.id) : [...joined, c.id] })}>
                  {isJoined ? tr("منضم", "Joined") : tr("انضمام", "Join")}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
