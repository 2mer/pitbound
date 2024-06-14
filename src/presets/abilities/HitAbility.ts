import { Ability } from "@/types/Ability";
import { Fighter } from "@/types/Fighter";
import { Attacker } from "../components/Attacker";
import Icon from '@/assets/icons/ability/hit.png';
import { HandBrick } from "../bricks/HandBrick";
import { Tuple } from "@/types/Tuple";
import { serializable } from "@/system/Serialization";
import { Brick } from "@/types/Brick";
import type { INestFighter } from "@/types/INest";

export @serializable('ability.hit') class HitAbility<T extends INestFighter> extends Ability<T> {
	image = Icon;

	name = 'Hit';

	constructor() {
		super();
		this.components.addAll(
			new Attacker()
		)
	}

	get $attacker() {
		return this.components.getT(Attacker);
	}

	cost = Tuple(HandBrick);

	canUse(): boolean {
		const match = this.parent!.fighter.bricks.getPattern(this.cost, Brick.canUseBrick);
		return match.ok;
	}

	onUse(): void {
		const { fighter, stage } = this.parent!;

		const match = fighter.bricks.getPattern(this.cost, Brick.canUseBrick);

		const attacker = this.$attacker!;

		fighter.update();

		stage.startTargeting<Fighter>({
			ability: this,
			caster: fighter,

			canTarget(target) {
				return target instanceof Fighter;
			},

			onTarget(target) {
				const firstBrick = target.getLivingBricks().at(-1);
				if (!firstBrick) return;

				firstBrick.damage({ attacker: fighter, amount: attacker.attack });

				match.hits.forEach(Brick.useBrick)
				stage.stopTargeting();

				target.update();
			},
		})
	}

	getDescription(): string {
		return `Damage targeted brick for ${this.$attacker!.attack}`
	}
}