import { describe, it, expect } from "vitest";
import { getTier, isVerified, canCreateCommunity, voteXpDelta } from "@/lib/tiers";

describe("tiers", () => {
  it("tier boundaries", () => {
    expect(getTier(49).id).toBe("explorer");
    expect(getTier(50).id).toBe("contributor");
    expect(getTier(149).id).toBe("contributor");
    expect(getTier(150).id).toBe("specialist");
    expect(getTier(250).id).toBe("elite");
  });
  it("verified badge at 250+", () => {
    expect(isVerified(249)).toBe(false);
    expect(isVerified(250)).toBe(true);
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
