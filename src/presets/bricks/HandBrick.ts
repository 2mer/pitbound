import { Brick } from "@/types/Brick";
import Icon from '@/assets/icons/brick/hand.png';
import { HitAbility } from "../abilities/HitAbility";

export class HandBrick extends Brick {
	name = 'Hand';
	image = Icon;

	constructor() {
		super();

		this.abilities.addAll(
			new HitAbility()
		)
	}

	getDescription(): string {
		return `Can use or hit things`;
	}
}