import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { voteXpDelta } from "./tiers";
import type { L } from "./data";
import { useCloud } from "./cloud-store";

type Lang = "ar" | "en";
type Theme = "dark" | "light";
type State = {
  lang: Lang; theme: Theme; xp: number; loggedIn: boolean;
  votes: Record<string, -1 | 0 | 1>; authorXp: Record<string, number>;
  battleVotes: Record<string, "a" | "b">; pollVotes: Record<string, number>;
  joined: string[]; notifications: number;
};
const initial: State = {
  lang: "ar", theme: "dark", xp: 180, loggedIn: true, votes: {}, authorXp: {}, battleVotes: {}, pollVotes: {}, joined: [], notifications: 3,
};

type Ctx = State & {
  t: (l: L) => string; tr: (ar: string, en: string) => string;
  set: (p: Partial<State>) => void;
  vote: (postId: string, authorId: string, v: -1 | 1) => void;
};
const C = createContext<Ctx | null>(null);
const KEY = "aimc-state-v1";

export function AppProvider({ children }: { children: ReactNode }) {
  const cloud = useCloud();
  const [s, setS] = useState<State>(initial);
  useEffect(() => {
    try { const raw = localStorage.getItem(KEY); if (raw) setS({ ...initial, ...JSON.parse(raw) }); } catch {}
  }, []);
  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(s));
    const el = document.documentElement;
    el.lang = s.lang; el.dir = s.lang === "ar" ? "rtl" : "ltr";
    el.classList.toggle("dark", s.theme === "dark");
  }, [s]);

  const set = (p: Partial<State>) => setS((o) => ({ ...o, ...p }));
  const vote = (postId: string, authorId: string, v: -1 | 1) =>
    setS((o) => {
      const prev = o.votes[postId] ?? 0;
      const next = (prev === v ? 0 : v) as -1 | 0 | 1;
      const d = voteXpDelta(prev, next);
      return { ...o, votes: { ...o.votes, [postId]: next }, authorXp: { ...o.authorXp, [authorId]: (o.authorXp[authorId] ?? 0) + d } };
    });

  const t = (l: L) => l[s.lang];
  const tr = (ar: string, en: string) => (s.lang === "ar" ? ar : en);
  return <C.Provider value={{ ...s, xp: cloud.xp, loggedIn: !!cloud.user, joined: cloud.joined, t, tr, set, vote }}>{children}</C.Provider>;
}

export function useApp() {
  const c = useContext(C);
  if (!c) throw new Error("useApp outside provider");
  return c;
}
