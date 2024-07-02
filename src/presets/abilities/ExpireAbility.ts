import { Ability } from "@/types/Ability";
import Icon from '@/assets/icons/ability/explosion.png';
import { serializable } from "@/system/Serialization";
import type { INestFighter } from "@/types/INest";

export @serializable('ability.expire') class ExpireAbility<T extends INestFighter> extends Ability<T> {
	image = Icon;

	name = 'Expire';

	constructor() {
		super();
	}


	canUse(): boolean {
		return true;
	}

	onUse(): void {
		const { stage, fighter } = this.parent!;
		const { event } = fighter;

		event.fighters.removeChild(fighter);
		stage.update();
	}

	getDescription(): string {
		return `Unit is removed from the stage`
	}
}