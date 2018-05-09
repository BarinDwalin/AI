export enum HeroStates { Greed }

const statesName: string[] = [];
statesName[HeroStates.Greed] = 'Жадность';

export function getHeroStateName(state: HeroStates): string {
  return statesName[state] || HeroStates[state];
}
