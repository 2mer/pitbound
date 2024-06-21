import { serializable } from "@/system/Serialization";
import { Item } from "@/types/Item";

export @serializable('item.air') class AirItem extends Item {
	name = 'air'
} 