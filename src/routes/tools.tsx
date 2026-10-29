import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ExternalLink, Star, Plus } from "lucide-react";
import { useApp } from "@/lib/app-store";
import { TOOLS, TOOL_CATEGORIES } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { SubmitToolDialog } from "@/components/submit-tool";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tools")({
  head: () => ({
    meta: [
      { title: "دليل أدوات الذكاء الاصطناعي | AI Magic City" },
      { name: "description", content: "اكتشف أفضل أدوات الذكاء الاصطناعي حسب التصنيف وأضف أداتك." },
      { property: "og:title", content: "دليل أدوات الذكاء الاصطناعي" },
      { property: "og:description", content: "أفضل أدوات الذكاء الاصطناعي في مكان واحد." },
    ],
  }),
  component: Tools,
});

function Tools() {
  const { t, tr } = useApp();
  const [cat, setCat] = useState("all");
  const [open, setOpen] = useState(false);
  const list = TOOLS.filter((x) => cat === "all" || x.cat === cat).sort((a, b) => Number(b.featured) - Number(a.featured));
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-black">{tr("أدوات الذكاء الاصطناعي", "AI Tools")}</h1>
        <Button onClick={() => setOpen(true)}><Plus />{tr("أضف أداتك", "Submit your tool")}</Button>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TOOL_CATEGORIES.map((c) => (
          <button key={c.id} onClick={() => setCat(c.id)} className={cn("shrink-0 rounded-full border px-4 py-1.5 text-sm", cat === c.id ? "border-primary bg-primary text-primary-foreground" : "hover:border-primary/50")}>{tr(c.ar, c.en)}</button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((x) => (
          <div key={x.id} className={cn("relative flex flex-col gap-3 rounded-2xl border bg-card p-5", x.featured && "border-primary/50 glow")}>
            {x.featured && <span className="absolute end-4 top-4 rounded-full bg-gold px-2 py-0.5 text-xs font-bold text-primary-foreground">{tr("مميز", "Featured")}</span>}
            <div className="grid size-12 place-items-center rounded-xl bg-muted text-xl font-black text-primary">{x.name[0]}</div>
            <div className="font-bold">{x.name}</div>
            <p className="text-sm text-muted-foreground">{t(x.desc)}</p>
            <div className="mt-auto flex items-center justify-between">
              <span className="flex items-center gap-1 text-sm"><Star className="size-4 fill-primary text-primary" />{x.rating}</span>
              <Button asChild size="sm" variant="outline">
                <a href={`${x.url}?ref=aimagiccity`} target="_blank" rel="noopener sponsored">{tr("جرّب الأداة", "Try it")}<ExternalLink /></a>
              </Button>
            </div>
          </div>
        ))}
      </div>
      <SubmitToolDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
