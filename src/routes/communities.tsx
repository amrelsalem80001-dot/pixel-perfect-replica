import { createFileRoute, Link } from "@tanstack/react-router";
import { Bot, Workflow, Cpu, Clapperboard, Lock, Plus, Users } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/lib/app-store";
import { useCloud } from "@/lib/cloud-store";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { canCreateCommunity } from "@/lib/tiers";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export const Route = createFileRoute("/communities")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
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
  const { t, tr, xp, joined } = useApp();
  const cloud = useCloud();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const allowed = canCreateCommunity(xp);
  const lockMsg = "يتطلب إنشاء مجتمع جديد جمع 50 نقطة XP على الأقل من خلال التفاعل والمشاركات";
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-black">{tr("المجتمعات", "Communities")}</h1>
        <Tooltip>
          <TooltipTrigger asChild>
            <span tabIndex={0}>
              <Button disabled={!allowed} onClick={() => setOpen(true)}>
                {allowed ? <Plus /> : <Lock />}{tr("إنشاء مجتمع جديد", "Create community")}
              </Button>
            </span>
          </TooltipTrigger>
          {!allowed && <TooltipContent className="max-w-xs">{tr(lockMsg, "Creating a community requires at least 50 XP earned through engagement and posts")}</TooltipContent>}
        </Tooltip>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {cloud.platform.communities.map((c) => {
          const Icon = ICONS[c.icon as keyof typeof ICONS] ?? Users;
          const isJoined = joined.includes(c.id);
          return (
            <div key={c.id} className="flex flex-col gap-3 rounded-2xl border bg-card p-5 transition hover:border-primary/40">
              <div className="grid size-12 place-items-center rounded-xl bg-gold text-primary-foreground"><Icon /></div>
              <h2 className="text-lg font-bold">{t(c.name)}</h2>
              <p className="text-sm text-muted-foreground">{t(c.desc)}</p>
              <div className="mt-auto flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{(cloud.stats.communityMembers[c.id] ?? 0).toLocaleString()} {tr("عضو", "members")}</span>
                {cloud.user ? <Button size="sm" variant={isJoined ? "outline" : "default"} disabled={isJoined} onClick={() => cloud.join(c.id).catch(() => toast.error(tr("تعذر الانضمام، حاول مجدداً", "Could not join. Try again.")))}>
                  {isJoined ? tr("أنت عضو بالفعل ✓", "Already a member ✓") : tr("انضمام", "Join")}
                </Button> : <Button asChild size="sm"><Link to="/profile">{tr("انضمام", "Join")}</Link></Button>}
              </div>
            </div>
          );
        })}
      </div>
      <Dialog open={open} onOpenChange={setOpen}><DialogContent><DialogHeader><DialogTitle>{tr("إنشاء مجتمع", "Create community")}</DialogTitle><DialogDescription>{tr("مجتمع جديد في المدينة", "A new city community")}</DialogDescription></DialogHeader>
        <form className="space-y-4" onSubmit={async e => { e.preventDefault(); if (!cloud.user || !allowed) return; setBusy(true); try { const id = crypto.randomUUID(); const result = await supabase.from("communities").insert({ id, created_by: cloud.user.id, name: { ar: name.trim(), en: name.trim() }, description: { ar: description.trim(), en: description.trim() }, icon: "Users" }); if (result.error) throw result.error; await cloud.refresh(); setOpen(false); setName(""); setDescription(""); toast.success(tr("تم إنشاء المجتمع", "Community created")); } catch { toast.error(tr("تعذر إنشاء المجتمع", "Could not create community")); } finally { setBusy(false); } }}>
          <Input aria-label="Community name" placeholder={tr("اسم المجتمع", "Community name")} value={name} onChange={e => setName(e.target.value)} required maxLength={80} />
          <Textarea aria-label="Community description" placeholder={tr("وصف المجتمع", "Community description")} value={description} onChange={e => setDescription(e.target.value)} required maxLength={280} />
          <Button disabled={busy || !name.trim()} type="submit">{tr("إنشاء", "Create")}</Button>
        </form>
      </DialogContent></Dialog>
    </div>
  );
}
