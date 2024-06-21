import { serializable, serialize } from "@/system/Serialization";
import { Item } from "@/types/Item";
import Icon from '@/assets/icons/item/sword.png';
import { Assets } from "pixi.js";
import { EquipmentSlot } from "../slot/EquipmentSlot";
import { SlashAbility } from "../abilities/SlashAbility";
import type { Brick } from "@/types/Brick";
import { Rarity } from "@/types/Rarity";

Assets.load(Icon);

export @serializable('item.sword') class SwordItem extends Item {
	name = 'Sword'
	icon = Icon
	rarity = Rarity.COMMON

	@serialize abilityId?: string;

	onEquip(slot: EquipmentSlot): void {
		super.onEquip(slot);

		const brick = slot.parent!

		const slash = new SlashAbility<Brick>().transform(a => a.$attacker!.set({ attack: 3 }));
		this.abilityId = slash.id;

		brick.abilities.addAll(
			slash
		);
	}

	onUnEquip(slot: EquipmentSlot): void {
		super.onUnEquip(slot);

		const brick = slot.parent!;

		const ability = brick.abilities.values().find(a => a.id === this.abilityId);

		if (ability) {
			brick.abilities.removeChild(
				ability
			)
		}
	}
}