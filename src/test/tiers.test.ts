import { describe, it, expect } from "vitest";
import { getTier, isVerified, canCreateCommunity, voteXpDelta, tierProgress } from "@/lib/tiers";

describe("tiers", () => {
  it("tier boundaries", () => {
    expect(getTier(49).id).toBe("explorer");
    expect(getTier(50).id).toBe("contributor");
    expect(getTier(149).id).toBe("contributor");
    expect(getTier(150).id).toBe("specialist");
    expect(getTier(250).id).toBe("specialist");
    expect(getTier(299).id).toBe("specialist");
    expect(getTier(300).id).toBe("elite");
  });
  it("verified badge begins at 50 XP", () => {
    expect(isVerified(49)).toBe(false);
    expect(isVerified(50)).toBe(true);
  });
  it("progress targets 300 XP for a technical pro", () => {
    expect(tierProgress(180).remaining).toBe(120);
    expect(tierProgress(180).percent).toBe(20);
    expect(tierProgress(300).percent).toBe(100);
  });
  it("community creation needs 50 XP", () => {
    expect(canCreateCommunity(49)).toBe(false);
    expect(canCreateCommunity(50)).toBe(true);
  });
  it("upvote +5, downvote -2", () => {
    expect(voteXpDelta(0, 1)).toBe(5);
    expect(voteXpDelta(0, -1)).toBe(-2);
    expect(voteXpDelta(1, -1)).toBe(-7);
  });
});
