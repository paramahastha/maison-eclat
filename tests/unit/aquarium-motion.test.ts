import { describe, expect, it } from "vitest";
import { advanceFloatingPose, aquariumEntry, AQUARIUM_IMPACT_TIME } from "@/lib/aquarium-motion";

describe("submerged bottle motion", () => {
  it("stays bounded and finite through long runs and a suspended-tab delta", () => {
    const pose = { height: 0, velocity: 0, roll: 0, angularVelocity: 0 };
    for (let frame = 0; frame < 7200; frame++) {
      advanceFloatingPose(pose, frame / 60, frame === 3000 ? 30 : 1 / 60);
      expect(Math.abs(pose.height)).toBeLessThanOrEqual(.12);
      expect(Math.abs(pose.roll)).toBeLessThanOrEqual(.09);
      expect(Number.isFinite(pose.velocity)).toBe(true);
    }
  });
  it("keeps the floating pose consistent at 30, 60 and 120Hz", () => {
    const poses = [30, 60, 120].map((fps) => {
      const pose = { height: 0, velocity: 0, roll: 0, angularVelocity: 0 };
      for (let frame = 1; frame <= fps * 20; frame++) advanceFloatingPose(pose, frame / fps, 1 / fps);
      return pose;
    });
    for (const pose of poses) {
      expect(Math.abs(pose.height - poses[1].height)).toBeLessThan(.004);
      expect(Math.abs(pose.roll - poses[1].roll)).toBeLessThan(.004);
    }
  });
});


describe("aquarium entry", () => {
  it("starts outside the frame and descends without an anticipatory rise", () => {
    expect(aquariumEntry(0).height).toBeGreaterThan(5);
    let previous = aquariumEntry(0).height;
    for (let t = .01; t < AQUARIUM_IMPACT_TIME + .7; t += .01) {
      const next = aquariumEntry(t).height;
      expect(next).toBeLessThanOrEqual(previous);
      previous = next;
    }
    expect(aquariumEntry(AQUARIUM_IMPACT_TIME - .001).wet).toBe(0);
    expect(aquariumEntry(AQUARIUM_IMPACT_TIME + .6).wet).toBe(1);
  });
  it("preserves position and velocity through contact, then settles", () => {
    const t = AQUARIUM_IMPACT_TIME, h = .00001;
    const left = (aquariumEntry(t).height - aquariumEntry(t-h).height) / h;
    const right = (aquariumEntry(t+h).height - aquariumEntry(t).height) / h;
    expect(Math.abs(left-right)).toBeLessThan(.001);
    expect(aquariumEntry(12).height).toBeCloseTo(-.06, 5);
    expect(aquariumEntry(12).roll).toBeCloseTo(0, 5);
  });
});
