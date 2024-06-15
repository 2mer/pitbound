import { postDeserialize, serializable, serialize } from "../system/Serialization";
import { WorldEvent } from "./WorldEvent";
import { Nested, related } from "./Nested";
import type { Stage } from "./Stage";
import { EmptyEvent } from "../presets/worldevents/EmptyEvent";
import { R3, V, weightedRandom } from "../utils/PRandom";
import { WEIGHTED_EVENT_GENERATORS } from "../presets/worldevents";
import { SerializableMap } from "../system/SerializableMap";
import { RopeConnection } from "./RopeConnection";
import { PartyEvent } from "../presets/worldevents/PartyEvent";

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
	persistentEvents = new SerializableMap<string, WorldEvent>();
	persistentRopes: RopeConnection[] = [];
	nodeToRopeMap = new Map<string, RopeConnection[]>();

	@serialize @related
	leftEvent: WorldEvent<any> = new EmptyEvent();
	@serialize @related
	rightEvent: WorldEvent<any> = new EmptyEvent();

	constructor() {
		super();
		this.init();
	}

	@postDeserialize
	init() {
		this.persistentRopes.forEach(rope => {
			this.addRopeLookup(rope);
		})
	}

	getOppositeEvent(event: WorldEvent<any>) {
		return this.leftEvent === event ? this.rightEvent : this.leftEvent;
	}

	getWorldSide(event: WorldEvent<any>): WorldSide {
		return this.leftEvent === event ? 'LEFT' : 'RIGHT';
	}

	getEvents() {
		return [this.leftEvent, this.rightEvent];
	}

	getPartyEvent() {
		return this.leftEvent as unknown as PartyEvent;
	}

	canMove() {
		return this.getEvents().every(e => !e.isBlocking()) || this.getPartyEvent().fighters.values().every(f => f.isDead() || f.hasFled);
	}

	moveTo(position: WorldPosition) {
		this.position = position;
		this.age++;
		this.parent!.turn = 0;

		const newEvent = this.getEventAt(position);

		this.rightEvent = newEvent;

		this.rightEvent.onAdded(this);

		this.rightEvent.onVisit();

		this.parent!.update();

	}

	positionToKey(position: WorldPosition) {
		return position.depth + "_" + position.horizontalIndex;
	}

	getEventAt(position: WorldPosition): WorldEvent<any> {

		const found = this.persistentEvents.get(this.positionToKey(position));

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

	persist(event: WorldEvent<any>) {
		this.persistentEvents.set(this.positionToKey(this.position), event);
	}

	addRopeLookup(rope: RopeConnection) {
		this.nodeToRopeMap.set(this.positionToKey(rope.from), [...(this.nodeToRopeMap.get(this.positionToKey(rope.from)) ?? []), rope]);
		this.nodeToRopeMap.set(this.positionToKey(rope.to), [...(this.nodeToRopeMap.get(this.positionToKey(rope.to)) ?? []), rope]);
	}


	createRopeConnection(to: WorldPosition) {
		const rope = new RopeConnection().set({
			from: { ...this.position },
			to,
		});
		this.persistentRopes.push(rope);
		this.addRopeLookup(rope);
	}

	removeRopeConnection(rope: RopeConnection) {

		const withoutRope = (r: RopeConnection) => r !== rope;

		this.persistentRopes = this.persistentRopes.filter(withoutRope);

		this.nodeToRopeMap.set(this.positionToKey(rope.from), (this.nodeToRopeMap.get(this.positionToKey(rope.from)) ?? []).filter(withoutRope));
		this.nodeToRopeMap.set(this.positionToKey(rope.to), (this.nodeToRopeMap.get(this.positionToKey(rope.to)) ?? []).filter(withoutRope));
	}

	removeNodeRopes(position: WorldPosition) {
		const ropes = this.nodeToRopeMap.get(this.positionToKey(position)) ?? [];

		ropes.forEach(r => {
			this.removeRopeConnection(r);
		})
	}
};