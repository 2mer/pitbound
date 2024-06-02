import { EventGenrator, World, WorldPosition } from "@/types/World";
import { WorldEvent } from "@/types/WorldEvent";
import { EmptyEvent } from "./EmptyEvent";
import { BattleScenarios } from "./BattleScenarios";
import { R2, randomEntry } from "@/utils/PRandom";

const BASE_WEIGHT = 10;

export class SimpleGenerator<T extends typeof WorldEvent> implements EventGenrator<InstanceType<T>> {
	clzz;

	minDepth = 0;
	maxDepth = Infinity;

	minHorizontalIndex = 0;
	maxHorizontalIndex = Infinity;

	constructor(clzz: T) {
		this.clzz = clzz;
	}

	canGenerate(world: World, position: WorldPosition): boolean {
		if (position.depth < this.minDepth) return false;
		if (position.depth > this.maxDepth) return false;

		if (position.horizontalIndex < this.minHorizontalIndex) return false;
		if (position.horizontalIndex > this.maxHorizontalIndex) return false;

		return true;
	}

	generate(world: World, position: WorldPosition): InstanceType<T> {
		return new (this.clzz)() as any;
	}

	public set<T extends Partial<this>>(data: T) {
		Object.assign(this, data);

		return this;
	}
}

export const WEIGHTED_EVENT_GENERATORS = [
	// empty
	[BASE_WEIGHT, new SimpleGenerator(EmptyEvent)],

	// battle
	[BASE_WEIGHT, {
		canGenerate(world, position) {
			return BattleScenarios.some(s => s.canGenerate(world, position));
		},

		generate(world, position) {
			const battleGenerator = randomEntry(BattleScenarios.filter(s => s.canGenerate(world, position)), R2(position.depth, position.horizontalIndex))!;

			return battleGenerator.generate(world, position);
		},
	}],
] satisfies [weight: number, generator: EventGenrator<any>][];