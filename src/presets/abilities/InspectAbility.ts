import { Ability } from "@/types/Ability";
import { Brick } from "@/types/Brick";
import Icon from '@/assets/icons/ability/insepct.png';
import { serializable } from "@/system/Serialization";

export @serializable('ability.inspect') class InspectAbility extends Ability<Brick> {
	image = Icon;
	name = 'Inspect';
	description = 'Click on an element to log it out to the console';

	canUse() {
		return true;
	}

	onUse(): void {
		const stage = this.parent!.stage;

		stage.startTargeting<any>({
			ability: this,

			canTarget() {
				return true;
			},

			onTarget(target) {
				console.log({ target });

				stage.stopTargeting();
			},
		})
	}
}