import type { ReactNode } from "react";
import { ChevronUp, ChevronDown, MessageSquare, Copy, FileJson, FileCode, Download, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/lib/app-store";
import { MEMBERS, COMMUNITIES, type Post } from "@/lib/data";
import { VerifiedBadge } from "./shell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TYPE_LABEL = {
  discussion: { ar: "نقاش", en: "Discussion" }, question: { ar: "سؤال برمجي", en: "Question" },
  poll: { ar: "استطلاع رأي", en: "Poll" }, showcase: { ar: "إبداع", en: "Showcase" },
};

function highlight(src: string) {
  const re = /(#.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|\b(import|from|with|as|for|in|def|return|if|else|print|class|const|let|await|async)\b|\b(\d+)\b/gm;
  const out: ReactNode[] = [];
  let last = 0, m: RegExpExecArray | null, i = 0;
  while ((m = re.exec(src))) {
    out.push(src.slice(last, m.index));
    const cls = m[1] ? "text-muted-foreground italic" : m[2] ? "text-success" : m[3] ? "text-primary font-semibold" : "text-cyber";
    out.push(<span key={i++} className={cls}>{m[0]}</span>);
    last = re.lastIndex;
  }
  out.push(src.slice(last));
  return out;
}

export function PostCard({ post }: { post: Post }) {
  const { t, tr, votes, vote, authorXp, loggedIn, pollVotes, set } = useApp();
  const author = MEMBERS.find((m) => m.id === post.authorId)!;
  const community = COMMUNITIES.find((c) => c.id === post.community)!;
  const my = votes[post.id] ?? 0;
  const score = post.score + my;
  const aXp = author.xp + (authorXp[author.id] ?? 0);
  const myPoll = pollVotes[post.id];

  return (
    <article className="flex gap-3 rounded-2xl border bg-card p-4 transition hover:border-primary/30">
      <div className="flex flex-col items-center gap-0.5">
        <button aria-label="upvote" onClick={() => vote(post.id, author.id, 1)} className={cn("rounded-md p-1 transition hover:bg-accent", my === 1 && "text-primary")}><ChevronUp className="size-6" /></button>
        <span className={cn("text-sm font-bold", my === 1 && "text-primary", my === -1 && "text-destructive")}>{score}</span>
        <button aria-label="downvote" onClick={() => vote(post.id, author.id, -1)} className={cn("rounded-md p-1 transition hover:bg-accent", my === -1 && "text-destructive")}><ChevronDown className="size-6" /></button>
      </div>
      <div className="min-w-0 flex-1 space-y-3">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
          <span className="rounded-full bg-accent px-2 py-0.5 font-medium text-accent-foreground">{t(TYPE_LABEL[post.type])}</span>
          <span>{t(community.name)}</span>·
          <span className="inline-flex items-center gap-1 font-medium text-foreground">{author.name}<VerifiedBadge xp={aXp} /></span>
          <span>⚡{aXp}</span>·<span>{t(post.time)}</span>
          {post.answered && <span className="inline-flex items-center gap-1 text-success"><CheckCircle2 className="size-3.5" />{tr("تم قبول إجابة", "Answer accepted")}</span>}
        </div>
        <h3 className="text-lg font-bold leading-snug">{t(post.title)}</h3>
        <p className="text-sm text-muted-foreground">{t(post.body)}</p>

        {post.code && (
          <div className="overflow-hidden rounded-xl border bg-muted/50" dir="ltr">
            <div className="flex items-center justify-between border-b px-3 py-1.5 text-xs text-muted-foreground">
              <span>{post.code.lang}</span>
              <button className="inline-flex items-center gap-1 hover:text-primary" onClick={() => { navigator.clipboard.writeText(post.code!.src); toast.success(tr("تم نسخ الكود", "Code copied")); }}>
                <Copy className="size-3.5" />{tr("نسخ الكود", "Copy code")}
              </button>
            </div>
            <pre className="overflow-x-auto p-3 text-sm leading-relaxed"><code>{highlight(post.code.src)}</code></pre>
          </div>
        )}

        {post.attachment && (
          <div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-accent/40 p-3">
            <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-gold text-primary-foreground">
              {post.attachment.kind === "n8n" ? <FileJson className="size-5" /> : <FileCode className="size-5" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold" dir="ltr">{post.attachment.name}</div>
              <div className="text-xs text-muted-foreground">{post.attachment.kind === "n8n" ? "n8n Workflow" : "Python Script"} · {post.attachment.size}</div>
            </div>
            <Button size="sm" variant={loggedIn ? "default" : "outline"} onClick={() => {
              if (!loggedIn) { toast.error(tr("سجّل الدخول لتحميل الملف", "Log in to download")); return; }
              const content = post.attachment!.kind === "n8n" ? JSON.stringify({ name: t(post.title), nodes: [], connections: {} }, null, 2) : `# ${t(post.title)}\nprint("AI Magic City")\n`;
              const url = URL.createObjectURL(new Blob([content], { type: "text/plain" }));
              const a = document.createElement("a"); a.href = url; a.download = post.attachment!.name; a.click();
              setTimeout(() => URL.revokeObjectURL(url), 30000);
            }}><Download />{tr("تحميل", "Download")}</Button>
          </div>
        )}

        {post.poll && (
          <div className="space-y-2">
            {post.poll.options.map((o, i) => {
              const votesArr = post.poll!.votes.map((v, j) => v + (myPoll === j ? 1 : 0));
              const total = votesArr.reduce((a, b) => a + b, 0);
              const pct = Math.round(((votesArr[i] ?? 0) / total) * 100);
              return (
                <button key={i} onClick={() => set({ pollVotes: { ...pollVotes, [post.id]: i } })} className={cn("relative w-full overflow-hidden rounded-lg border p-2.5 text-start text-sm", myPoll === i && "border-primary")}>
                  <div className="absolute inset-y-0 start-0 bg-primary/20 transition-all" style={{ width: myPoll !== undefined ? `${pct}%` : 0 }} />
                  <span className="relative flex justify-between font-medium">{t(o)}{myPoll !== undefined && <span>{pct}%</span>}</span>
                </button>
              );
            })}
          </div>
        )}

        <div className="flex items-center gap-1 text-sm text-muted-foreground"><MessageSquare className="size-4" />{post.comments} {tr("تعليق", "comments")}</div>
      </div>
    </article>
  );
}
