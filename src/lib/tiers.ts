export type TierId = "explorer" | "contributor" | "specialist" | "elite";

export const TIERS: { id: TierId; min: number; ar: string; en: string }[] = [
  { id: "explorer", min: 0, ar: "مستكشف", en: "Explorer" },
  { id: "contributor", min: 50, ar: "عضو معتمد", en: "Active Contributor" },
  { id: "specialist", min: 150, ar: "محترف تقني", en: "Tech Pro" },
  { id: "elite", min: 300, ar: "نخبة الذكاء الاصطناعي / VIP", en: "AI Elite / VIP" },
];

export const COMMUNITY_XP_GATE = 50;
export const UPVOTE_XP = 5;
export const DOWNVOTE_XP = -2;

export function getTier(xp: number) {
  let t = TIERS[0] ?? { id: "explorer" as const, min: 0, ar: "مستكشف", en: "Explorer" };
  for (const tier of TIERS) if (xp >= tier.min) t = tier;
  return t;
}
export const isVerified = (xp: number) => xp >= 50;
export function tierProgress(xp: number) {
  const current = getTier(xp);
  const next = TIERS.find(t => t.min > xp);
  return { current, next, remaining: next ? next.min - xp : 0, percent: next ? Math.max(0, Math.min(100, (xp - current.min) / (next.min - current.min) * 100)) : 100 };
}
export const canCreateCommunity = (xp: number) => xp >= COMMUNITY_XP_GATE;

/** XP delta for the author when a voter moves from `prev` to `next` vote (-1,0,1). */
export function voteXpDelta(prev: -1 | 0 | 1, next: -1 | 0 | 1) {
  const val = (v: number) => (v === 1 ? UPVOTE_XP : v === -1 ? DOWNVOTE_XP : 0);
  return val(next) - val(prev);
}
