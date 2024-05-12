import { Brick } from "./Brick";
import DummyImage from '../assets/icons/fighter/dummy16.png';
import { Item } from "./Item";
import Color from "color";
import { Effect } from "./Effect";
import { v4 } from "uuid";
import EventEmitter from "eventemitter3";
import { Stage } from "./Stage";
import { Children, Nested } from "./Nested";
import { ComponentSystem } from "./Component";

export type FighterEvents = {
	update: () => void;
}

export class Fighter extends Nested<Stage> {
	id = v4();
	effects = new ComponentSystem<Effect<Fighter>>();
	inventory = new ComponentSystem<Item<Fighter>>();
	bricks = new Children<Brick>();
	events = new EventEmitter<FighterEvents>();

	height: number = 64;
	width: number = 64;

	image: string = DummyImage;

	name = 'fighter';

	color = new Color(0xFAFAFA);

	related = [
		this.effects,
		this.bricks,
		this.inventory,
	] as Nested<this>[]

	private _isDead = false;

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

	public set<T extends Partial<this>>(data: T) {
		Object.assign(this, data);

		return this;
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