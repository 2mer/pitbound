import { Ability } from "@/types/Ability";
import { Attacker } from "../components/Attacker";
import Icon from '@/assets/icons/ability/flee.png';
import { Tuple } from "@/types/Tuple";
import { serializable } from "@/system/Serialization";
import { Brick } from "@/types/Brick";
import { LegBrick } from "../bricks/LegBrick";
import type { INestFighter } from "@/types/INest";

export @serializable('ability.flee') class FleeAbility<T extends INestFighter> extends Ability<T> {
	image = Icon;

	name = 'Flee';

	constructor() {
		super();
		this.components.addAll(
			new Attacker()
		)
	}

	get $attacker() {
		return this.components.$(Attacker);
	}

	cost = Tuple(LegBrick);

	canUse(): boolean {
		const match = this.parent!.fighter.bricks.getPattern(this.cost, Brick.canUseBrick);
		return match.ok;
	}

	onUse(): void {
		const fighter = this.parent!.fighter;

		fighter.flee();
	}

	getDescription(): string {
		return `Damage targeted brick for ${this.$attacker!.attack}`
	}
}