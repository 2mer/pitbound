import { serializable, serialize } from "@/system/Serialization";
import { WorldEvent } from "./WorldEvent";
import { Nested, related } from "./Nested";
import { Stage } from "./Stage";
import { EmptyEvent } from "@/presets/worldevents/EmptyEvent";

export type WorldSide = 'LEFT' | 'RIGHT'

export @serializable('world') class World extends Nested<Stage> {
	@serialize
	age = 0;

	@serialize
	position = {
		depth: 0,
		horizontalIndex: 0,
	};

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
};