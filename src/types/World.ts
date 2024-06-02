import { serializable, serialize } from "@/system/Serialization";
import { WorldEvent } from "./WorldEvent";
import { Nested, related } from "./Nested";
import { Stage } from "./Stage";
import { EmptyEvent } from "@/presets/worldevents/EmptyEvent";
import { R3, V, weightedRandom } from "@/utils/PRandom";
import { WEIGHTED_EVENT_GENERATORS } from "@/presets/worldevents";
import { SerializableMap } from "@/system/SerializableMap";

export type WorldSide = 'LEFT' | 'RIGHT'

export type WorldPosition = {
	depth: number;
	horizontalIndex: number;
}

export type EventGenrator<T extends WorldEvent = WorldEvent> = {
	canGenerate(world: World, position: WorldPosition): boolean,
	generate(world: World, position: WorldPosition): T,
}

export @serializable('world') class World extends Nested<Stage> {
	@serialize
	age = 0;

	@serialize
	position = {
		depth: 0,
		horizontalIndex: 0,
	};

	@serialize
	persistent = new SerializableMap<string, WorldEvent>();

	@serialize @related
	leftEvent: WorldEvent = new EmptyEvent();
	@serialize @related
	rightEvent: WorldEvent = new EmptyEvent();

	getOppositeEvent(event: WorldEvent) {
		return this.leftEvent === event ? this.rightEvent : this.leftEvent;
	}

	getWorldSide(event: WorldEvent): WorldSide {
		return this.leftEvent === event ? 'LEFT' : 'RIGHT';
	}

	getEvents() {
		return [this.leftEvent, this.rightEvent];
	}

	canMove() {
		return this.getEvents().every(e => !e.isBlocking());
	}

	moveTo(position: WorldPosition) {
		this.position = position;

		const newEvent = this.getEventAt(position);

		this.rightEvent = newEvent;

		this.rightEvent.onAdded(this);

		this.parent!.update();
	}

	positionToKey(position: WorldPosition) {
		return position.depth + "_" + position.horizontalIndex;
	}

	getEventAt(position: WorldPosition): WorldEvent {

		const found = this.persistent.get(this.positionToKey(position));

		if (found) {
			return found;
		}

		const r = R3(position.depth, position.horizontalIndex, 0);

		const generatorIndex = weightedRandom(r, WEIGHTED_EVENT_GENERATORS.filter(e => e[1].canGenerate(this, position)).map(e => e[0]));
		const generator = WEIGHTED_EVENT_GENERATORS[generatorIndex][1];

		return generator.generate(this, position);

	}

	getDangerAt(position: WorldPosition) {
		return V.perlinNoise(V.from(position.depth, position.horizontalIndex));
	}

	persist(event: WorldEvent) {
		this.persistent.set(this.positionToKey(this.position), event);
	}
};