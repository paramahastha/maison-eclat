import { describe, expect, it } from 'vitest';
import { collectionIndex, getSceneOpacity, getStoryPose } from '@/lib/story-choreography';

describe('Scroll story choreography', () => {
  it('keeps the hero turn restrained and restores the exact pose when scrolling back', () => {
    const start = getStoryPose('hero', 0);
    const end = getStoryPose('hero', 1);
    expect(end.rotationY - start.rotationY).toBeLessThan(Math.PI / 4);
    expect(end.travelY).toBeGreaterThan(0);
    getStoryPose('hero', .7);
    expect(getStoryPose('hero', 0)).toEqual(start);
  });
  it('hides the model at chapter seams before selecting a new camera target', () => {
    expect(getSceneOpacity('hero', 1, 1)).toBe(0);
    expect(getSceneOpacity('hero', .74, 1, 0, false)).toBe(0);
    expect(getSceneOpacity('composition', 0, .8)).toBe(0);
    expect(getSceneOpacity('composition', .5, .8, .8)).toBe(0);
    expect(getSceneOpacity('composition', .5, .8, .1)).toBeGreaterThan(.9);
    expect(getSceneOpacity('collection', 0, 1, 0, true)).toBe(1);
    expect(getSceneOpacity('collection', .94, 1, 0, true)).toBe(1);
    expect(getSceneOpacity('collection', 1, 1, 0, true)).toBe(1);
    expect(getSceneOpacity('collection', 1, .2, 0, true)).toBeLessThan(.25);
  });
  it('opens the cap for composition and closes it for the final invitation', () => {
    expect(getStoryPose('composition', .5).capLift).toBeGreaterThan(.1);
    expect(getStoryPose('invitation', 1).capLift).toBe(0);
    expect(getStoryPose('composition', 0).capLift).toBe(0);
  });
  it('maps the three scroll stops to consistent, bounded fragrance identities', () => {
    expect([-1,0,.5,1,2].map(collectionIndex)).toEqual([0,0,1,2,2]);
    expect(getStoryPose('hero', -10)).toEqual(getStoryPose('hero',0));
    expect(getStoryPose('hero', 10)).toEqual(getStoryPose('hero',1));
  });
});
