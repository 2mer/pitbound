import Icon from '@/assets/icons/brick/claw.png';
import { serializable } from '@/system/Serialization';
import { ScratchAbility } from '../abilities/ScratchAbility';
import { Brick } from '@/types/Brick';

export @serializable('brick.claw') class ClawBrick extends Brick {
	name = 'Claw';
	image = Icon;

	constructor() {
		super();

		this.abilities.addAll(
			new ScratchAbility()
		)
	}

	getDescription(): string {
		return `Can scratch things`;
	}
}