import { postDeserialize, serializable, serialize } from "@/system/Serialization";
import { Fighter } from "@/types/Fighter";
import { Children, related } from "@/types/Nested";
import { WorldEvent, WorldEventEvents } from "@/types/WorldEvent";
import { subs } from "@/utils/Subs";

export type FighterEventEvents = WorldEventEvents & {
	allFightersDead: () => void;
}

export @serializable('worldEvent.fighterEvent') class FighterEvent extends WorldEvent<FighterEventEvents> {
	name = 'Fighter Event';


	@serialize @related fighters = new Children<Fighter>();

	constructor() {
		super();
		this.init();
	}

	@postDeserialize
	init() {
		this.fighters.effect(fighter => {
			return subs(fighter.events, {
				death: () => {
					if (this.fighters.values().every(f => f.isDead())) {
						this.events.emit('allFightersDead');
					}
				}
			})
		})
	}

	addFighters(...fighters: Fighter[]) {
		this.fighters.addAll(...fighters);
		return this;
	}

	getAbove(fighter: Fighter, minDistance: number = 1, maxDistance: number = 1) {
		const allies = this.fighters.values();
		const fIndex = allies.indexOf(fighter);
		const minIndex = 0;

		return allies.slice(Math.max(minIndex, fIndex - maxDistance), Math.max(minIndex, fIndex - minDistance + 1)).filter(f => f !== fighter);
	}

	getBelow(fighter: Fighter, minDistance: number = 1, maxDistance: number = 1) {
		const allies = this.fighters.values();
		const fIndex = allies.indexOf(fighter);
		const maxIndex = allies.length;

		return allies.slice(Math.min(fIndex + minDistance, maxIndex), Math.min(fIndex + maxDistance + 1, maxIndex)).filter(f => f !== fighter);
	}

	getNeighboors(fighter: Fighter, minDistance: number = 1, maxDistance: number = 1) {
		return [
			...this.getAbove(fighter, minDistance, maxDistance),
			...this.getBelow(fighter, minDistance, maxDistance),
		]
	}

	isBlocking(): boolean {
		return this.fighters.values().some(f => f.isHostile && f.isAlive());
	}

}
