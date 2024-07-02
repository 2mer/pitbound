import { serializable, serialize } from "@/system/Serialization";
import { Nested, related } from "./Nested";
import { Item } from "./Item";
import { AirItem } from "@/presets/items/AirItem";
import EventEmitter from "eventemitter3";
import { v4 } from "uuid";

export type SlotEvents = {
	itemRemoved: (item: Item) => void
	itemPlaced: (item: Item) => void
}

export @serializable('slot') class Slot<T = any> extends Nested<T> {
	@serialize @related item: Item = new AirItem();
	@serialize id: string = v4();
	events = new EventEmitter<SlotEvents>();

	removeItem() {
		const old = this.item;

		if (!this.isEmpty()) {
			this.item = new AirItem();

			this.events.emit('itemRemoved', old);
		}

		return old;
	}

	placeItem(item: Item) {
		const old = this.item;

		if (!this.isEmpty()) {
			this.removeItem();
		}

		this.item = item;

		this.events.emit('itemPlaced', item);

		return old;
	}

	canPlaceItem(_item: Item) {
		return true;
	}

	canRemoveItem(_item: Item) {
		return true;
	}

	swapSlot(other: Slot) {
		const prev = this.removeItem();
		const next = other.removeItem();

		other.placeItem(prev);
		this.placeItem(next);
	}

	isEmpty() {
		return this.item instanceof AirItem
	}
}

