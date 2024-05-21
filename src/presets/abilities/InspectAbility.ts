import { Ability } from "@/types/Ability";
import { Brick } from "@/types/Brick";
import Icon from '@/assets/icons/ability/insepct.png';
import { Stage } from "@/types/Stage";

export class InspectAbility extends Ability<Brick> {
	image = Icon;
	name = 'Inspect';
	description = 'Click on an element to log it out to the console';

	canClick() {
		return true;
	}

	onClick(): void {
		const stage = this.closest(Stage)!;

		stage.startTargeting<any>({
			ability: this,

			canTarget(target) {
				return true;
			},

			onTarget(target) {
				console.log({ target });

				stage.stopTargeting();
			},
		})
	}
}