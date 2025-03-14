import { serializable } from "@/system/Serialization";
import { Brick } from "@/types/Brick";
import { Keyword } from "@/types/Keyword";
import Color from "color";

export @serializable('keyword.essential') class EssentialKeyword extends Keyword<Brick> {
	name = 'Essential';
	color = new Color(0xFF00FF);

	description = 'If I dont have any brick with this keyword, I die';

	onAdded(target: Brick): void {
		super.onAdded(target);

		target.events.on('death', this.handleTargetDeath, this);
	}

	onRemoved(target: Brick): void {
		super.onRemoved(target);

		target.events.off('death', this.handleTargetDeath, this);
	}

	handleTargetDeath() {
		const target = this.parent!.fighter;

		if (!target.getLivingBricks().some(b => b.keywords.hasT(EssentialKeyword))) {
			target.die();
		}
	}
}