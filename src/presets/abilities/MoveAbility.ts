import { Ability } from "@/types/Ability";
import { Brick } from "@/types/Brick";
import Icon from '@/assets/icons/ability/move.png';
import { serializable, serialize } from "@/system/Serialization";
import { Fighter } from "@/types/Fighter";
import { LegBrick } from "../bricks/LegBrick";
import { Targeting } from "@/types/Targeting";


export @serializable('ability.move') class MoveAbility extends Ability<Brick> {
	name = 'Move';
	image = Icon;

	@serialize
	minDistance = 1;

	@serialize
	maxDistance = 1;

	cost = [LegBrick];

	canClick() {
		const fighter = this.closest(Fighter)!;
		const { event } = fighter;

		const match = this.closest(Fighter)!.bricks.getPattern(this.cost, Brick.canUseBrick);
		if (!match.ok) return false;

		const neighboors = event.getNeighboors(fighter, this.minDistance, this.maxDistance);

		return neighboors.length > 0;
	}

	onClick(): void {
		const fighter = this.closest(Fighter)!;
		const { stage, allies, event } = fighter;

		const alliesList = allies.values()

		const selfIndex = alliesList.indexOf(fighter);

		const neighboors = event.getNeighboors(fighter, this.minDistance, this.maxDistance);

		const match = fighter!.bricks.getPattern(this.cost, Brick.canUseBrick);

		stage.startTargeting(Targeting<Fighter>({
			ability: this,
			caster: fighter,

			canTarget(target) {
				return neighboors.includes(target);
			},

			onTarget(target) {
				allies.items.splice(selfIndex, 1);

				const swapIndex = allies.items.indexOf(target);

				allies.items.splice(swapIndex >= selfIndex ? swapIndex + 1 : swapIndex, 0, fighter);

				match.hits.forEach(Brick.useBrick)

				stage.update();

				stage.stopTargeting();
			},
		}))
	}

	getDescription(): string {

		const spaces = () => {
			if (this.minDistance === this.maxDistance) return this.minDistance;

			return `${this.minDistance}-${this.maxDistance}`;
		}

		return `Move the fighter ${spaces()} spaces`
	}
}