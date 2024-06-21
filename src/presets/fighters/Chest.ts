import { Fighter } from "@/types/Fighter";
import Image from '../../assets/icons/fighter/chest.png';
import Color from "color";
import { serializable } from "@/system/Serialization";
import { LargeBagBrick } from "../bricks/LargeBagBrick";

export @serializable('fighter.chest') class Chest extends Fighter {
	name = 'Chest';
	image = Image;
	color = new Color(0x71413b);

	constructor() {
		super();

		this.bricks.addAll(
			new LargeBagBrick().set({ maxHealth: 5, health: 5 })
		)
	}
}