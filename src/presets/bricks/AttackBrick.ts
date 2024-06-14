import { Brick } from "@/types/Brick";
import Icon from '@/assets/icons/brick/hand.png';
import { Attacker } from "../components/Attacker";
import { Usable } from "../components/Usable";
import { serializable } from "@/system/Serialization";

export @serializable('brick.attack') class AttackBrick extends Brick {
	name = 'Attack';
	image = Icon;

	constructor() {
		super();

		this.components.addAll(
			new Attacker(),
			new Usable<Brick>(),
		)
	}

	get attacker() {
		return this.components.getT(Attacker)
	}

	get usable() {
		return this.components.getT(Usable<Brick>)
	}

	public canClick(): boolean {
		if (this.fighter.isHostile) return false;

		return this.usable!.canUse();
	}
}