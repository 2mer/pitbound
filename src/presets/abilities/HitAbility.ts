import { Ability } from "@/types/Ability";
import { Fighter } from "@/types/Fighter";
import { Attacker } from "../components/Attacker";
import Icon from '@/assets/icons/ability/hit.png';
import { HandBrick } from "../bricks/HandBrick";
import { Tuple } from "@/types/Tuple";
import { serializable } from "@/system/Serialization";
import { Brick } from "@/types/Brick";

export @serializable('ability.hit') class HitAbility<T> extends Ability<T> {
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

	canClick(): boolean {

		const match = this.closest(Fighter)!.bricks.getPattern(this.cost, Brick.canUseBrick);
		return match.ok;
	}

	onClick(): void {
		const fighter = this.closest(Fighter)!;
		const stage = fighter.stage;

		const enemies = stage.getEnemies(fighter).values();

		enemies.forEach(e => {
			const firstBrick = e.getLivingBricks().at(-1);
			if (!firstBrick) return;

			firstBrick.damage({ attacker: fighter, amount: this.$attacker!.attack });
		})

		const match = this.closest(Fighter)!.bricks.getPattern(this.cost, Brick.canUseBrick);
		match.hits.forEach(Brick.useBrick)

		fighter.update();
	}

	getDescription(): string {
		return `Damage targeted brick for ${this.$attacker!.attack}`
	}
}