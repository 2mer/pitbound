import { EventGenrator, World, WorldPosition } from "@/types/World";
import type { WorldEvent } from "@/types/WorldEvent";
import { EmptyEvent } from "./EmptyEvent";
import { BattleScenarios } from "./BattleScenarios";
import { R2, R3, randomEntry } from "@/utils/PRandom";
import { TreasureEvent } from "./TreasureEvent";
import { Chest } from "../fighters/Chest";
import { SwordItem } from "../items/SwordItem";
import { StickItem } from "../items/StickItem";
import { Mimic } from "../fighters/Mimic";

const BASE_WEIGHT = 10;

export class SimpleGenerator<T extends typeof WorldEvent<any>> implements EventGenrator<InstanceType<T>> {
	clzz;

	minDepth = 0;
	maxDepth = Infinity;

	minHorizontalIndex = 0;
	maxHorizontalIndex = Infinity;

	constructor(clzz: T) {
		this.clzz = clzz;
	}

	canGenerate(_: World, position: WorldPosition): boolean {
		if (position.depth < this.minDepth) return false;
		if (position.depth > this.maxDepth) return false;

		if (position.horizontalIndex < this.minHorizontalIndex) return false;
		if (position.horizontalIndex > this.maxHorizontalIndex) return false;

		return true;
	}

	generate(): InstanceType<T> {
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

	// threasure
	[BASE_WEIGHT / 2, {
		canGenerate() {
			return true;
		},

		generate(world, position) {

			const isHostile = R3(position.depth * 2104.7816, position.horizontalIndex * 8921.3012, world.getCycleAt(position) * 2342.12342) < 0.1;

			const chest = new Chest().transform(c => {
				const inv = c.bricks.values()[0].inventory.values()

				inv[0].placeItem(new SwordItem())
				inv[1].placeItem(new StickItem())
			});

			return new TreasureEvent().addFighters(
				isHostile ? new Mimic().set({ chest }).hostile() : chest,
			)
		}
	}],

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