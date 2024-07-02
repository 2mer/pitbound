import { serializable, serialize } from "@/system/Serialization";
import { Nested } from "./Nested";
import type { Slot } from "./Slot";
import Icon from '@/assets/icons/brick/unknown.png';
import { v4 } from "uuid";
import { Assets } from "pixi.js";
import { EquipmentSlot } from "@/presets/slot/EquipmentSlot";
import { Rarity } from "./Rarity";

Assets.load(Icon);

export @serializable('item') class Item extends Nested<Slot> {
	@serialize name = 'item';
	@serialize id: string = v4();
	icon = Icon;
	rarity: Rarity = Rarity.BASIC;

	@serialize equipped = false;

	onEquip(_slot: EquipmentSlot) {
		this.equipped = true;
	}
	onUnEquip(_slot: EquipmentSlot) {
		this.equipped = false;
	}
}