import { BadgeCheck } from "lucide-react";
import { getTier } from "@/lib/tiers";
import { useApp } from "@/lib/app-store";
import { cn } from "@/lib/utils";

export function VerifiedBadge({ xp, showTitle = true }: { xp: number; showTitle?: boolean }) {
  const { tr } = useApp();
  const tier = getTier(xp);
  return <span className={cn('inline-flex items-center gap-1 text-xs font-medium', `tier-${tier.id}`)} title={tr(tier.ar, tier.en)}>
    {xp >= 50 && <BadgeCheck className="size-4 shrink-0" aria-label={tr('عضو موثق', 'Verified member')} />}
    {showTitle && <span>{tr(tier.ar, tier.en)}</span>}
  </span>;
}