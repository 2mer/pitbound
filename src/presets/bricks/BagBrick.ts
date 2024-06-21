import { Brick } from "@/types/Brick";
import Icon from '@/assets/icons/brick/bag.png';
import { serializable } from "@/system/Serialization";
import { BrickSlot } from "../slot/BrickSlot";

export @serializable('brick.bag') class BagBrick extends Brick {
	name = 'Bag';
	image = Icon;

	constructor() {
		super();

		this.inventory.addAll(
			new BrickSlot(),
			new BrickSlot(),
		)
	}

	getDescription(): string {
		return `Can store items`;
	}
}