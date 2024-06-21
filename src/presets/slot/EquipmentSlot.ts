import { serializable } from "@/system/Serialization";
import { BrickSlot } from "./BrickSlot";
import { Item } from "@/types/Item";


export @serializable('slot.equipment') class EquipmentSlot extends BrickSlot {

	removeItem() {
		if (this.item.equipped) {
			this.item.onUnEquip(this);
		}

		return super.removeItem();
	}

	placeItem(item: Item): Item {
		const old = super.placeItem(item);

		if (!item.equipped) {
			item.onEquip(this);
		}

		return old;
	}

}
