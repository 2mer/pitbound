import { Brick } from "@/types/Brick";
import Icon from '@/assets/icons/brick/hand.png';
import { Attacker } from "../components/Attacker";
import { Usable } from "../components/Usable";

export class HandBrick extends Brick {
	name = 'Hand';
	image = Icon;

	$attacker = this.components.addChild(new Attacker());
	$usable = this.components.addChild(new Usable());

	public canClick(): boolean {
		if (!this.stage.isFriendly(this.fighter)) return false;

		return this.$usable.canUse();
	}

	getDescription(): string {
		return `Target thy eggman`;
	}
}