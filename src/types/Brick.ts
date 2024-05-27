import { v4 } from 'uuid';
import Color from "color";
import { Stage } from './Stage';
import { Fighter } from './Fighter';
import { Effect } from './Effect';
import UnknownImage from '../assets/icons/brick/unknown.png'
import { Keyword } from './Keyword';
import EventEmitter from 'eventemitter3';
import { Component, ComponentSystem } from './Component';
import { Nested, related } from './Nested';
import { Ability } from './Ability';
import { Usable } from '@/presets/components/Usable';
import { playSound } from '@/utils/SoundPlayer';
import { serializable, serialize } from '@/system/Serialization';

export type ActionCtx = {
	stage: Stage;
	fighter: Fighter;
}

export type TargetedCtx = { invoker: Fighter, target: Fighter, stage: Stage };

export type Events = {
	damage: (ctx: { attacker: Fighter, amount: number }) => void
	heal: (ctx: { healer: Fighter, amount: number }) => void
	death: (ctx: { attacker: Fighter }) => void
}

export type Ctx<T extends keyof Events> = Events[T] extends (e: infer R) => any ? R : never;

export @serializable('brick') class Brick extends Nested<Fighter> {
	@serialize @related effects = new ComponentSystem<Effect<Brick>>();
	@serialize @related keywords = new ComponentSystem<Keyword<Brick>>();
	@serialize @related components = new ComponentSystem<Component<Brick>>().transform(c => c.addAll(new Usable<Brick>()));
	@serialize @related abilities = new ComponentSystem<Ability<Brick>>();
	events = new EventEmitter<Events>();

	get $usable() {
		return this.components.getT(Usable<Brick>);
	}

	@serialize id = v4();
	@serialize health = 0;
	@serialize maxHealth = 0;
	shields = 0;
	invincible = false;
	@serialize level = 1;

	height = 32 * 4;
	width = 32;

	color = new Color(0xFFFFFF);

	image = UnknownImage;

	@serialize
	name = 'Brick';
	description = '';

	contributesToHealth = true;

	get fighter() {
		return this.parent!;
	}

	get stage() {
		return this.fighter.stage;
	}

	public isAlive() {
		if (this.invincible) return true;

		return this.health > 0;
	}

	public isDead() {
		return !this.isAlive();
	}

	public hasHealth() {
		return !this.invincible;
	}

	public missingHealth() {
		return this.maxHealth - this.health;
	}

	public heal(ctx: Ctx<'heal'>) {
		if (this.hasHealth()) {
			const { amount } = ctx;
			this.health = Math.min(this.maxHealth, this.health + amount);

			this.events.emit('heal', ctx);

			this.fighter.update();
		}
	}

	public damage(ctx: Ctx<'damage'>) {
		if (this.hasHealth()) {
			const { amount } = ctx;
			this.health = Math.max(0, this.health - amount);

			this.events.emit('damage', ctx);

			if (this.isDead()) {
				this.onDeath(ctx);
			}

			this.fighter.update();
			playSound('hurt');
		}
	}

	public onDeath(ctx: Ctx<'death'>) {
		this.events.emit('death', ctx);
	}

	public getWidth() {
		return this.width;
	}

	public canClick(): boolean {
		if (!this.isAdded) return false;

		const allAbilities = this.abilities.values();
		if (!allAbilities.length) return false;

		return allAbilities.some(a => a.canClick());
	}

	getDescription() {
		return this.description;
	}

	static canUseBrick(brick: Brick) {
		return brick.$usable!.canUse();
	}

	static useBrick(brick: Brick) {
		return brick.$usable!.use();
	}

}
