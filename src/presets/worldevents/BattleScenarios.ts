import { BattleEvent } from "./BattleEvent";

import { Fighter } from "@/types/Fighter";
import { World, WorldPosition } from "@/types/World";
import { Pitling } from "../fighters/Pitling";
import { Skull } from "../fighters/Skull";


export type BattleScenario = { canGenerate(world: World, position: WorldPosition): boolean; generate(world: World, position: WorldPosition): BattleEvent; };
const generateN = (n: number, generator: (i: number) => Fighter) => {
	return ({
		canGenerate(world: World, position: WorldPosition) {
			return true;
		},

		generate(world: World, position: WorldPosition) {
			return new BattleEvent().addFighters(
				...Array.from({ length: n }).fill(null).map((_, i) => generator(i))
			);
		},
	});
};

export const BattleScenarios: BattleScenario[] = [
	// N pitling
	...[1, 2, 3].map(i => generateN(i, () => new Pitling().hostile())),

	// N skull
	...[1, 2, 3].map(i => generateN(i, () => new Skull().hostile())),

	// Boss dev
	generateN(1, () => new Skull().hostile()),
];
