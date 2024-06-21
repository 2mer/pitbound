import { serializable } from "@/system/Serialization";
import { FighterEvent } from "./FighterEvent";
import Color from "color";
import Icon from '@/assets/icons/ui/treasure.png';
import { Assets } from "pixi.js";

Assets.load(Icon);

export @serializable('worldEvent.treasure') class TreasureEvent extends FighterEvent {
	name = 'Treasure';
	color = new Color(0xffd541);
	image = Icon;
}

