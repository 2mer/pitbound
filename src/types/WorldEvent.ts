import { serializable, serialize } from "@/system/Serialization";
import { v4 } from "uuid";
import { Nested } from "./Nested";
import EventEmitter from "eventemitter3";
import { World } from "./World";

type Events = {
	update: () => void;
}

export @serializable('worldEvent') class WorldEvent extends Nested<World> {
	events = new EventEmitter<Events>();

	@serialize
	id = v4();
	name = 'World Event';
	isBlocking = false;
	isComplete = false;

	get world() {
		return this.parent!;
	}

	get stage() {
		return this.world.parent!;
	}


	get side() {
		return this.world.getWorldSide(this);
	}

	getOppositeEvent() {
		return this.parent!.getOppositeEvent(this);
	}

}