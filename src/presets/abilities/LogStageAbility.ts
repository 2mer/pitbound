import { Ability } from "@/types/Ability";
import { Brick } from "@/types/Brick";
import { serializable } from "@/system/Serialization";
import Icon from '@/assets/icons/ability/speak.png';

export @serializable('ability.logStage') class LogStageAbility extends Ability<Brick> {
	image = Icon;
	name = 'Log Stage';
	description = 'Log the stage to the console';

	canUse() {
		return true;
	}

	onUse(): void {
		const stage = this.parent!.stage;

		console.log({ stage });
	}
}