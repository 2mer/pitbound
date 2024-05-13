import { Ability } from "@/types/Ability";
import { Fighter } from "@/types/Fighter";
import { Attacker } from "../components/Attacker";
import Icon from '@/assets/icons/ability/hit.png';
import { HandBrick } from "../bricks/HandBrick";
import { Tuple } from "@/types/Tuple";

export class HitAbility<T> extends Ability<T> {
	image = Icon;

	name = 'Hit';

	$attacker = this.components.addChild(new Attacker());

	cost = Tuple(HandBrick);

	canClick(): boolean {
		const match = this.closest(Fighter)!.bricks.getPattern(this.cost);

		return match.every(b => Boolean(b) && b.$usable.canUse())
	}

	onClick(): void {
		const fighter = this.closest(Fighter)!;
		const stage = fighter.stage;

		const enemies = stage.getEnemies(fighter).values();

		enemies.forEach(e => {
			const firstBrick = e.getLivingBricks().at(-1);
			if (!firstBrick) return;

			firstBrick.damage({ attacker: fighter, amount: this.$attacker.attack });
		})

		const match = this.closest(Fighter)!.bricks.getPattern(this.cost);

		console.log({ match });

		match.every(b => b.$usable.use())
		fighter.update();
	}

	getDescription(): string {
		return `Damage targeted brick for ${this.$attacker.attack}`
	}
}