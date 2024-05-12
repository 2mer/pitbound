import { v4 } from 'uuid';
import Color from "color";
import { Stage } from './Stage';
import { Fighter } from './Fighter';
import { Effect } from './Effect';
import UnknownImage from '../assets/icons/brick/unknown.png'
import { Keyword } from './Keyword';
import EventEmitter from 'eventemitter3';
import { Component, ComponentSystem } from './Component';
import { Nested } from './Nested';

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

export class Brick extends Nested<Fighter> {
	effects = new ComponentSystem<Effect<Brick>>();
	keywords = new ComponentSystem<Keyword<Brick>>();
	components = new ComponentSystem<Component<Brick>>();
	events = new EventEmitter<Events>();

	related = [
		this.effects,
		this.keywords,
		this.components,
	] as Nested<this>[]

	id = v4();
	health = 0;
	maxHealth = 0;
	shields = 0;
	invincible = false;
	level = 1;

	height = 150;
	width = 32;

	color = new Color(0xFFFFFF);

	image = UnknownImage;

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
		}
	}

	public onClick() {

	}

	public onDeath(ctx: Ctx<'death'>) {
		this.events.emit('death', ctx);
	}

	public getWidth() {
		return this.width;
	}

	public set<T extends Partial<this>>(data: T) {
		Object.assign(this, data);

		return this;
	}

	public canClick(): boolean {
		return false;
	}

	getDescription() {
		return this.description;
	}

}
