import { Brick } from "@/types/Brick";
import Icon from '@/assets/icons/brick/hand.png';
import { HitAbility } from "../abilities/HitAbility";
import { serializable } from "@/system/Serialization";
import { EquipmentSlot } from "../slot/EquipmentSlot";

export @serializable('brick.hand') class HandBrick extends Brick {
	name = 'Hand';
	image = Icon;

	constructor() {
		super();

		this.abilities.addAll(
			new HitAbility()
		)

		this.inventory.addAll(
			new EquipmentSlot()
		)
	}

	getDescription(): string {
		return `Can use or hit things`;
	}
}