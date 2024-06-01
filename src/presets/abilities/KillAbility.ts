import { Ability } from "@/types/Ability";
import { Fighter } from "@/types/Fighter";
import Icon from '@/assets/icons/ability/target.png';
import { HandBrick } from "../bricks/HandBrick";
import { Tuple } from "@/types/Tuple";
import { serializable } from "@/system/Serialization";
import { Brick } from "@/types/Brick";

export @serializable('ability.kill') class KillAbility extends Ability<Brick> {
	image = Icon;

	name = 'Kill';

	constructor() {
		super();
	}

	cost = Tuple(HandBrick);

	canClick(): boolean {

		const match = this.closest(Fighter)!.bricks.getPattern(this.cost, Brick.canUseBrick);
		return match.ok;
	}

	onClick(): void {
		const fighter = this.closest(Fighter)!;
		const stage = fighter.stage;

		const match = fighter.bricks.getPattern(this.cost, Brick.canUseBrick);

		fighter.update();

		stage.startTargeting<Fighter>({
			ability: this,
			caster: fighter,

			canTarget(target) {
				return target instanceof Fighter;
			},

			onTarget(target) {

				match.hits.forEach(Brick.useBrick)

				target.die();

				stage.stopTargeting();
			},
		})
	}

	getDescription(): string {
		return `Kill target`
	}
}