import { Brick } from "./Brick";
import DummyImage from '../assets/icons/fighter/dummy16.png';
import { Item } from "./Item";
import Color from "color";
import { Effect } from "./Effect";
import { v4 } from "uuid";
import EventEmitter from "eventemitter3";
import { Nested, related } from "./Nested";
import { ComponentSystem } from "./Component";
import { postDeserialize, serializable, serialize } from "@/system/Serialization";
import { FighterEvent } from "@/presets/worldevents/FighterEvent";
import { subs } from "@/utils/Subs";
import { playSound } from "@/utils/SoundPlayer";

export type FighterEvents = {
	update: () => void;
	death: () => void;
}

export @serializable('fighter') class Fighter extends Nested<FighterEvent> {
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

	@serialize isHostile = false;

	constructor() {
		super();
		this.init();
	}

	@postDeserialize
	init() {
		this.bricks.effect(brick => {
			return subs(brick.events, {
				death: () => {
					if (this.isDead()) {
						this.die();
					}
				},
			})
		})
	}

	get isFriendly() {
		return !this.isHostile;
	}

	get event() {
		return this.parent!;
	}

	get world() {
		return this.event.parent!;
	}

	get stage() {
		return this.world.parent!;
	}

	get allies() {
		return this.event.fighters;
	}

	die() {
		this._isDead = true;
		this.events.emit('death');
		this.update();
		playSound('die');
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

	hostile() {
		this.isHostile = true;
		return this;
	}
}