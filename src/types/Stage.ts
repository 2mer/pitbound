import EventEmitter from "eventemitter3";
import { Fighter } from "./Fighter";
import { Targeting } from "./Targeting";
import { Children } from "./Nested";
import { postDeserialize, serializable, serialize } from "@/system/Serialization";
import { v4 } from "uuid";

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

	@serialize friendly = new Children<Fighter>();

	@serialize hostile = new Children<Fighter>();

	targeting?: Targeting<any>;

	@serialize turn = 0;

	constructor() {
		this.init();
	}

	@postDeserialize
	init() {
		this.friendly.onAdded(this);
		this.hostile.onAdded(this);
	}

	isHostile(fighter: Fighter) {
		return this.hostile.values().some(f => f.id === fighter.id);
	}

	isFriendly(fighter: Fighter) {
		return this.friendly.values().some(f => f.id === fighter.id);
	}

	getSide(fighter: Fighter) {
		return this.isFriendly(fighter) ? Side.FRIENDLY : Side.HOSTILE;
	}

	getFighters(side: Side) {
		return this[side];
	}

	getEnemies(fighter: Fighter) {
		return this.getFighters(oppositeSide(this.getSide(fighter)));
	}

	getAllies(fighter: Fighter) {
		return this.getFighters(this.getSide(fighter));
	}

	getAllFighters() {
		return [...this.friendly.values(), ...this.hostile.values()];
	}

	addFighter(side: Side, fighter: Fighter) {
		this[side].addChild(fighter);
	}

	removeFighter(side: Side, fighter: Fighter) {
		this[side].removeChild(fighter);
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

		this.turn++;

		this.startTurn();
	}

	startTurn() {
		this.events.emit('turnStart', { stage: this })
	}
}