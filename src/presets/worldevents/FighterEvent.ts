import { serializable, serialize } from "@/system/Serialization";
import { Fighter } from "@/types/Fighter";
import { Children, related } from "@/types/Nested";
import { WorldEvent } from "@/types/WorldEvent";

export @serializable('worldEvent.fighterEvent') class FighterEvent extends WorldEvent {
	name = 'Fighter Event';

	@serialize @related fighters = new Children<Fighter>();

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

}
