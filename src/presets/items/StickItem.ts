import { serializable } from "@/system/Serialization";
import { Item } from "@/types/Item";
import Icon from '@/assets/icons/item/stick.png';
import { Assets } from "pixi.js";

Assets.load(Icon);

export @serializable('item.stick') class StickItem extends Item {
	name = 'Stick'
	icon = Icon
}