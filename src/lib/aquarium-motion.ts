export interface FloatingPose { height: number; velocity: number; roll: number; angularVelocity: number }

/** Near-neutral buoyancy with water drag, bounded to keep the bottle submerged. */
export function advanceFloatingPose(pose: FloatingPose, time: number, delta: number): void {
  const dt = Math.min(Math.max(delta, 0), 1 / 30);
  const current = Math.sin(time * .62) * .065 + Math.sin(time * 1.13) * .025;
  const torque = Math.sin(time * .43) * .065;
  pose.velocity += ((current - pose.height) * 3.2 - pose.velocity * 2.4) * dt;
  pose.height = Math.max(-.12, Math.min(.12, pose.height + pose.velocity * dt));
  pose.angularVelocity += ((torque - pose.roll) * 1.8 - pose.angularVelocity * 1.9) * dt;
  pose.roll = Math.max(-.09, Math.min(.09, pose.roll + pose.angularVelocity * dt));
}


// Contact occurs when the falling bottle base reaches the water plane.
export const AQUARIUM_DROP_START = .35;
export const AQUARIUM_IMPACT_TIME = AQUARIUM_DROP_START + Math.sqrt((5.6 - 3.5) / 9);
/** Position and velocity are continuous across free fall and underwater drag. */
export function aquariumEntry(time: number) {
  const t = Math.max(0, time);
  const fall = Math.max(0, t - AQUARIUM_DROP_START);
  const impactAge = t - AQUARIUM_IMPACT_TIME;
  const age = Math.max(0, impactAge);
  const entryVelocity = -18 * (AQUARIUM_IMPACT_TIME - AQUARIUM_DROP_START);
  const amplitude = 3.56;
  const sine = (entryVelocity + 2 * amplitude) / 2;
  const height = impactAge < 0 ? 5.6 - 9 * fall * fall
    : -.06 + Math.exp(-2 * age) * (amplitude * Math.cos(2 * age) + sine * Math.sin(2 * age));
  const wet = Math.min(1, age / .55);
  const roll = -.1 * Math.exp(-1.8 * age) * (Math.cos(3 * age) + .6 * Math.sin(3 * age));
  return { height, roll, wet: wet * wet * (3 - 2 * wet), impactAge,
    impact: impactAge < 0 ? 0 : Math.exp(-age * 1.5) };
}
