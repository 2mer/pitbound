import { Brick } from "@/types/Brick";
import Icon from '@/assets/icons/brick/largeBag.png';
import { serializable } from "@/system/Serialization";
import { BrickSlot } from "../slot/BrickSlot";

export @serializable('brick.largeBag') class LargeBagBrick extends Brick {
	name = 'Large Bag';
	image = Icon;

	width = 64;

	constructor() {
		super();

		this.inventory.addAll(
			new BrickSlot(),
			new BrickSlot(),
			new BrickSlot(),
			new BrickSlot(),
		)
	}

	getDescription(): string {
		return `Can store items`;
	}
}