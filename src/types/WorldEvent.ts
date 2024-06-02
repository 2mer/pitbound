import { serializable, serialize } from "@/system/Serialization";
import { v4 } from "uuid";
import { Nested } from "./Nested";
import EventEmitter from "eventemitter3";
import { World } from "./World";
import Color from "color";
import Icon from '@/assets/icons/ui/empty.png';
import { Assets } from "pixi.js";

type Events = {
	update: () => void;
}

Assets.load(Icon);

export @serializable('worldEvent') class WorldEvent extends Nested<World> {
	events = new EventEmitter<Events>();

	@serialize
	id = v4();
	name = 'World Event';

	color = new Color(0xFFFFFF);
	image = Icon;

	complete = false;

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
		return this.world.getOppositeEvent(this);
	}

	isBlocking() {
		return false;
	}

	isComplete() {
		return this.complete;
	}

	onVisit() {
		this.complete = true;
		this.world.persist(this);
	}

}