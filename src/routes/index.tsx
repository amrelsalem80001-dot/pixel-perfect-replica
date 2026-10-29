import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Star, ThumbsUp, ThumbsDown, Sparkles } from "lucide-react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts";
import skyline from "@/assets/skyline.png.asset.json";
import { useApp } from "@/lib/app-store";
import { MODEL_OF_WEEK, POSTS, COMMUNITIES, type PostType } from "@/lib/data";
import { PostCard } from "@/components/post-card";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Magic City | مدينة وسوق الذكاء الاصطناعي العربي" },
      { name: "description", content: "أكبر مجتمع عربي لأدوات ونماذج الذكاء الاصطناعي: نقاشات، مواجهات، تحديات وأدوات." },
      { property: "og:title", content: "AI Magic City — مدينة الذكاء الاصطناعي العربي" },
      { property: "og:description", content: "مجتمع عربي لأدوات ونماذج الذكاء الاصطناعي." },
    ],
  }),
  component: Index,
});

function Index() {
  const { t, tr } = useApp();
  const [filter, setFilter] = useState<PostType | "all">("all");
  const m = MODEL_OF_WEEK;
  const radar = m.radar.map((r) => ({ k: t(r.k), v: r.v }));
  const filters: { id: PostType | "all"; ar: string; en: string }[] = [
    { id: "all", ar: "الكل", en: "All" }, { id: "discussion", ar: "نقاش", en: "Discussion" }, { id: "question", ar: "سؤال برمجي", en: "Questions" },
    { id: "poll", ar: "استطلاع", en: "Polls" }, { id: "showcase", ar: "إبداع", en: "Showcase" },
  ];
  const posts = POSTS.filter((p) => filter === "all" || p.type === filter);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section className="relative overflow-hidden rounded-3xl border">
        <img src={skyline.url} alt="AI Magic City skyline" className="h-56 w-full object-cover sm:h-72" />
        <div className="absolute inset-0 bg-hero-fade" />
        <div className="absolute inset-x-0 bottom-0 p-6">
          <h1 className="text-3xl font-black sm:text-4xl">{tr("مدينة وسوق ", "The Arab ")}<span className="text-gold">{tr("الذكاء الاصطناعي العربي", "AI Magic City")}</span></h1>
          <p className="mt-2 max-w-xl text-muted-foreground">{tr("شارك، صوّت، تعلّم واجمع XP مع آلاف صناع الذكاء الاصطناعي.", "Share, vote, learn and earn XP with thousands of AI builders.")}</p>
        </div>
      </section>

      <section className="grid gap-6 rounded-3xl border border-primary/30 bg-card p-6 glow lg:grid-cols-[1fr_280px]">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-sm font-bold text-accent-foreground"><Sparkles className="size-4" />{tr("نموذج الأسبوع", "Model of the Week")}</div>
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <h2 className="text-3xl font-black">{m.name}</h2>
              <div className="text-sm text-muted-foreground">{m.vendor}</div>
            </div>
            <div className="ms-auto text-end">
              <div className="text-4xl font-black text-gold">{m.score}<span className="text-lg text-muted-foreground">/10</span></div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground"><Star className="size-3 fill-primary text-primary" />{tr("تقييم المجتمع", "Community score")}</div>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="mb-1 text-sm font-bold text-success">{tr("المميزات", "Pros")}</div>
              {m.pros.map((p, i) => <div key={i} className="flex items-center gap-2 text-sm"><ThumbsUp className="size-3.5 text-success" />{t(p)}</div>)}
            </div>
            <div>
              <div className="mb-1 text-sm font-bold text-destructive">{tr("العيوب", "Cons")}</div>
              {m.cons.map((p, i) => <div key={i} className="flex items-center gap-2 text-sm"><ThumbsDown className="size-3.5 text-destructive" />{t(p)}</div>)}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {m.uses.map((u, i) => <span key={i} className="rounded-full border px-3 py-1 text-xs">{t(u)}</span>)}
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer>
            <RadarChart data={radar} outerRadius="72%">
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="k" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
              <Radar dataKey="v" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.35} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <section className="space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {filters.map((f) => (
              <button key={f.id} onClick={() => setFilter(f.id)} className={cn("shrink-0 rounded-full border px-4 py-1.5 text-sm transition", filter === f.id ? "border-primary bg-primary text-primary-foreground" : "hover:border-primary/50")}>{tr(f.ar, f.en)}</button>
            ))}
          </div>
          {posts.map((p) => <PostCard key={p.id} post={p} />)}
        </section>
        <aside className="space-y-3">
          <h3 className="font-bold">{tr("المجتمعات الأساسية", "Core communities")}</h3>
          {COMMUNITIES.map((c) => (
            <Link key={c.id} to="/communities" className="block rounded-xl border bg-card p-3 text-sm transition hover:border-primary/40">
              <div className="font-semibold">{t(c.name)}</div>
              <div className="text-xs text-muted-foreground">{c.members.toLocaleString()} {tr("عضو", "members")}</div>
            </Link>
          ))}
        </aside>
      </div>
    </div>
  );
}
