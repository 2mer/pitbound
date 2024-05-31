import EventEmitter from "eventemitter3";
import { Fighter } from "./Fighter";
import { Targeting } from "./Targeting";
import { postDeserialize, serializable, serialize } from "@/system/Serialization";
import { v4 } from "uuid";
import { World } from "./World";
import { WorldEvent } from "./WorldEvent";
import { FighterEvent } from "@/presets/worldevents/FighterEvent";
import { playSound } from "@/utils/SoundPlayer";

export const Side = {
	FRIENDLY: 'friendly',
	HOSTILE: 'hostile',
} as const;
export type Side = typeof Side[keyof typeof Side];

export function oppositeSide(side: Side) {
	return side === Side.FRIENDLY ? Side.HOSTILE : Side.FRIENDLY;
}

type Events = {
	update: () => void;
	turnEnd: (ctx: { stage: Stage }) => void;
	turnStart: (ctx: { stage: Stage }) => void;
}


export @serializable('stage') class Stage {

	test = 'stage';
	events = new EventEmitter<Events>();

	@serialize id = v4();

	@serialize background: string = 'linear-gradient(to bottom, gray, darkgray)';

	targeting?: Targeting<any>;

	@serialize turn = 0;

	@serialize world = new World();

	constructor() {
		this.init();
	}

	@postDeserialize
	init() {
		this.world.onAdded(this);
	}

	getSide(fighter: Fighter) {
		return fighter.isFriendly ? Side.FRIENDLY : Side.HOSTILE;
	}


	update() {
		this.events.emit('update');
	}

	startTargeting<T>(t: Targeting<T>) {
		this.targeting = t;
		this.update();
	}

	stopTargeting() {
		this.targeting = undefined;
		this.update();
	}

	endTurn() {
		this.events.emit('turnEnd', { stage: this })

		playSound('click');

		this.turn++;

		this.update();

		this.startTurn();
	}

	startTurn() {
		this.events.emit('turnStart', { stage: this })
	}

	getCapabilities() {
		return {
			vision: {
				up: 3,
				down: 3,
			}
		}
	}

	getEventFighters(event: WorldEvent) {
		if (event instanceof FighterEvent) {
			return event.fighters.values();
		}

		return [];
	}

	getFigthers() {
		return [this.world.leftEvent, this.world.rightEvent].flatMap(this.getEventFighters);
	}

	getEnemies(fighter: Fighter) {
		const { isHostile } = fighter;

		return this.getFigthers().filter(f => f.isHostile !== isHostile);
	}
}