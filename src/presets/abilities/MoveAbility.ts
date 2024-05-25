import { Ability } from "@/types/Ability";
import { Brick } from "@/types/Brick";
import IconDown from '@/assets/icons/ability/down.png';
import IconUp from '@/assets/icons/ability/up.png';
import { serializable, serialize } from "@/system/Serialization";
import { Fighter } from "@/types/Fighter";
import { LegBrick } from "../bricks/LegBrick";

type Direction = 'up' | 'down';

const images = {
	down: IconDown,
	up: IconUp,
} satisfies { [key in Direction]: string };

const dirs = {
	up: -1,
	down: 1,
} satisfies { [key in Direction]: number };

export @serializable('ability.move') class MoveAbility extends Ability<Brick> {
	name = 'Move';

	@serialize
	direction: Direction = 'up';

	cost = [LegBrick];

	canClick() {
		const fighter = this.closest(Fighter)!;
		const stage = fighter.stage;

		const allies = stage.getAllies(fighter);
		const alliesList = allies.values()

		const selfIndex = alliesList.indexOf(fighter);
		const dir = dirs[this.direction]
		const swapIndex = selfIndex + dir;

		const match = this.closest(Fighter)!.bricks.getPattern(this.cost, Brick.canUseBrick);

		if (!match.ok) return false;

		return swapIndex >= 0 && swapIndex < alliesList.length;
	}

	onClick(): void {
		const fighter = this.closest(Fighter)!;
		const stage = fighter.stage;

		const allies = stage.getAllies(fighter);
		const alliesList = allies.values()

		const selfIndex = alliesList.indexOf(fighter);
		const dir = dirs[this.direction]
		const swapIndex = selfIndex + dir;

		const swapFighter = alliesList[swapIndex];

		alliesList[swapIndex] = fighter;
		alliesList[selfIndex] = swapFighter;

		const match = this.closest(Fighter)!.bricks.getPattern(this.cost, Brick.canUseBrick);
		match.hits.forEach(Brick.useBrick)

		stage.update();
	}

	getDescription(): string {
		return `Move the fighter ${this.direction}`
	}

	getImage(): string {
		return images[this.direction] ?? this.image;
	}
}