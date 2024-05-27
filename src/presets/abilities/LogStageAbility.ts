import { Ability } from "@/types/Ability";
import { Brick } from "@/types/Brick";
import { Stage } from "@/types/Stage";
import { serializable } from "@/system/Serialization";
import Icon from '@/assets/icons/ability/speak.png';

export @serializable('ability.logStage') class LogStageAbility extends Ability<Brick> {
	image = Icon;
	name = 'Log Stage';
	description = 'Log the stage to the console';

	canClick() {
		return true;
	}

	onClick(): void {
		const stage = this.closest(Stage)!;

		console.log({ stage });
	}
}