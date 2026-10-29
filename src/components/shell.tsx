import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Home, Users, Wrench, Swords, Trophy, Medal, Search, Bell, Plus, Sun, Moon, Languages, PanelRightClose, PanelRightOpen, Download, Share } from "lucide-react";
import { useApp } from "@/lib/app-store";
import { COMMUNITIES, MEMBERS, POSTS, TOOLS } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { SubmitToolDialog } from "./submit-tool";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useCloud } from "@/lib/cloud-store";
import { VerifiedBadge } from "./member-badge";
export { VerifiedBadge } from "./member-badge";

export const NAV = [
  { to: "/", icon: Home, ar: "الرئيسية", en: "Home" },
  { to: "/communities", icon: Users, ar: "المجتمعات", en: "Communities" },
  { to: "/tools", icon: Wrench, ar: "أدوات AI", en: "AI Tools" },
  { to: "/battles", icon: Swords, ar: "مواجهات AI", en: "AI Battles" },
  { to: "/challenges", icon: Trophy, ar: "التحديات", en: "Challenges" },
  { to: "/leaderboard", icon: Medal, ar: "المتصدرين", en: "Leaderboard" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const app = useApp();
  const cloud = useCloud();
  const { tr, lang, theme, xp, set } = app;
  const [collapsed, setCollapsed] = useState(false);
  const [cmd, setCmd] = useState(false);
  const [submit, setSubmit] = useState(false);
  const path = useRouterState({ select: (r) => r.location.pathname });


  useEffect(() => {
    const h = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setCmd((o) => !o); } };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  return (
    <div className="min-h-screen">
      <header className="glass sticky top-0 z-40 border-b">
        <div className="flex h-16 items-center gap-3 px-4">
          <Link to="/" className="font-display shrink-0 text-lg font-black tracking-wide text-gold logo-glow sm:text-xl">AI MAGIC CITY</Link>
          <button onClick={() => setCmd(true)} className="mx-auto hidden h-10 w-full max-w-md items-center gap-2 rounded-full border bg-muted/60 px-4 text-sm text-muted-foreground transition hover:border-primary/50 md:flex">
            <Search className="size-4" /> <span className="flex-1 text-start">{tr("ابحث في المنشورات والأدوات والأعضاء...", "Search posts, tools, members...")}</span>
            <kbd className="rounded border bg-background px-1.5 text-xs">Ctrl K</kbd>
          </button>
          <div className="ms-auto flex items-center gap-1 md:ms-0">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setCmd(true)} aria-label="search"><Search /></Button>
            <Button variant="ghost" size="sm" onClick={() => set({ lang: lang === "ar" ? "en" : "ar" })}><Languages />{lang === "ar" ? "EN" : "ع"}</Button>
            <Button variant="ghost" size="icon" onClick={() => set({ theme: theme === "dark" ? "light" : "dark" })} aria-label="theme">{theme === "dark" ? <Sun /> : <Moon />}</Button>
            <Button size="sm" className="hidden sm:inline-flex glow" onClick={() => setSubmit(true)}><Plus />{tr("أضف أداة", "Submit Tool")}</Button>
            <Button variant="ghost" size="icon" className="relative" onClick={() => set({ notifications: 0 })} aria-label="notifications">
              <Bell />{app.notifications > 0 && <span className="absolute -top-0.5 end-0.5 grid size-4 place-items-center rounded-full bg-destructive text-[10px] text-destructive-foreground">{app.notifications}</span>}
            </Button>
            <Link to="/profile" aria-label={tr("الملف الشخصي", "Profile")} title={tr("الملف الشخصي", "Profile")} className="flex shrink-0 items-center gap-2 rounded-full border bg-card p-1 lg:pe-3">
              <div className="grid size-8 shrink-0 place-items-center overflow-hidden rounded-full bg-gold font-bold text-primary-foreground">{cloud.profile?.avatarUrl ? <img src={cloud.profile.avatarUrl} alt="" className="size-full object-cover" /> : (cloud.profile?.display_name[0] ?? "ع")}</div>
              <div className="hidden leading-tight lg:block">
                <VerifiedBadge xp={xp} />
                <div className="text-sm font-bold text-primary">⚡ {xp} XP</div>
              </div>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className={cn("sticky top-16 hidden h-[calc(100vh-4rem)] shrink-0 flex-col border-e bg-sidebar p-3 transition-all md:flex", collapsed ? "w-16" : "w-60")}>
          <nav className="flex flex-col gap-1">
            {NAV.map((n) => {
              const active = n.to === "/" ? path === "/" : path.startsWith(n.to);
              return (
                <Link key={n.to} to={n.to} className={cn("flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition", active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
                  <n.icon className="size-5 shrink-0" />{!collapsed && <span>{tr(n.ar, n.en)}</span>}
                </Link>
              );
            })}
          </nav>
          <Button variant="ghost" size="icon" className="mt-auto self-end" onClick={() => setCollapsed((c) => !c)} aria-label="collapse">
            {collapsed ? <PanelRightOpen className="rtl:rotate-180" /> : <PanelRightClose className="rtl:rotate-180" />}
          </Button>
        </aside>
        <main className="min-w-0 flex-1 px-4 pb-24 pt-6 md:px-8 md:pb-10">{children}</main>
      </div>

      <nav className="glass fixed inset-x-0 bottom-0 z-40 grid grid-cols-6 border-t md:hidden">
        {NAV.map((n) => {
          const active = n.to === "/" ? path === "/" : path.startsWith(n.to);
          return (
            <Link key={n.to} to={n.to} className={cn("flex flex-col items-center gap-1 py-2 text-[10px]", active ? "text-primary" : "text-muted-foreground")}>
              <n.icon className="size-5" />{tr(n.ar, n.en)}
            </Link>
          );
        })}
      </nav>

      <CommandPalette open={cmd} onOpenChange={setCmd} />
      <SubmitToolDialog open={submit} onOpenChange={setSubmit} />
      <InstallPrompt />
    </div>
  );
}

function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { t, tr } = useApp();
  const nav = useNavigate();
  const go = (to: string) => { onOpenChange(false); nav({ to }); };
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder={tr("ابحث...", "Search...")} />
      <CommandList>
        <CommandEmpty>{tr("لا توجد نتائج", "No results")}</CommandEmpty>
        <CommandGroup heading={tr("المنشورات", "Posts")}>
          {POSTS.map((p) => <CommandItem key={p.id} onSelect={() => go("/")}>{t(p.title)}</CommandItem>)}
        </CommandGroup>
        <CommandGroup heading={tr("الأدوات", "Tools")}>
          {TOOLS.map((x) => <CommandItem key={x.id} onSelect={() => go("/tools")}>{x.name}</CommandItem>)}
        </CommandGroup>
        <CommandGroup heading={tr("المجتمعات", "Communities")}>
          {COMMUNITIES.map((c) => <CommandItem key={c.id} onSelect={() => go("/communities")}>{t(c.name)}</CommandItem>)}
        </CommandGroup>
        <CommandGroup heading={tr("الأعضاء", "Members")}>
          {MEMBERS.map((m) => <CommandItem key={m.id} onSelect={() => go("/leaderboard")}>{m.name} · @{m.handle}</CommandItem>)}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

type BIPEvent = Event & { prompt: () => Promise<void> };
function InstallPrompt() {
  const { tr } = useApp();
  const [open, setOpen] = useState(false);
  const [evt, setEvt] = useState<BIPEvent | null>(null);
  const [ios, setIos] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("aimc-pwa-dismissed")) return;
    const standalone = window.matchMedia("(display-mode: standalone)").matches;
    if (standalone) return;
    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    setIos(isIos);
    const h = (e: Event) => { e.preventDefault(); setEvt(e as BIPEvent); setOpen(true); };
    window.addEventListener("beforeinstallprompt", h);
    const timer = isIos ? setTimeout(() => setOpen(true), 4000) : undefined;
    return () => { window.removeEventListener("beforeinstallprompt", h); clearTimeout(timer); };
  }, []);
  const close = (o: boolean) => { if (!o) localStorage.setItem("aimc-pwa-dismissed", "1"); setOpen(o); };
  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{tr("ثبّت AI Magic City", "Install AI Magic City")}</DialogTitle>
          <DialogDescription>{tr("وصول أسرع من شاشتك الرئيسية.", "Faster access from your home screen.")}</DialogDescription>
        </DialogHeader>
        {ios ? (
          <ol className="list-decimal space-y-2 ps-5 text-sm">
            <li className="flex items-center gap-2">{tr("اضغط زر المشاركة", "Tap the Share button")} <Share className="size-4" /></li>
            <li>{tr("اختر «إضافة إلى الشاشة الرئيسية»", "Choose “Add to Home Screen”")}</li>
          </ol>
        ) : (
          <Button onClick={async () => { await evt?.prompt(); close(false); }}><Download />{tr("تثبيت التطبيق", "Install app")}</Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
