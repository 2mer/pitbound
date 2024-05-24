import { Brick } from "./Brick";
import DummyImage from '../assets/icons/fighter/dummy16.png';
import { Item } from "./Item";
import Color from "color";
import { Effect } from "./Effect";
import { v4 } from "uuid";
import EventEmitter from "eventemitter3";
import { Stage } from "./Stage";
import { Nested, related } from "./Nested";
import { ComponentSystem } from "./Component";
import { serializable, serialize } from "@/system/Serialization";

export type FighterEvents = {
	update: () => void;
}

export @serializable('fighter') class Fighter extends Nested<Stage> {
	@serialize id = v4();
	@serialize @related effects = new ComponentSystem<Effect<Fighter>>();
	@serialize @related inventory = new ComponentSystem<Item<Fighter>>();
	@serialize @related bricks = new ComponentSystem<Brick>();

	events = new EventEmitter<FighterEvents>();

	height: number = 64;
	width: number = 64;

	image: string = DummyImage;

	@serialize name = 'fighter';

	color = new Color(0xFAFAFA);

	@serialize private _isDead = false;

	get stage() {
		return this.parent!;
	}

	die() {
		this._isDead = true;
		this.update();
	}

	update() {
		this.events.emit('update');
	}

	getLivingBricks() {
		return this.bricks.values().filter(b => b.isAlive());
	}

	isDead() {
		return !this.isAlive();
	}

	isAlive() {
		if (this._isDead) return false;

		return this.getLivingBricks().filter(b => b.contributesToHealth).length > 0;
	}
}