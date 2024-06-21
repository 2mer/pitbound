import { Fighter } from "@/types/Fighter";
import Image from '../../assets/icons/fighter/collector.png';
import Color from "color";
import { HeartBrick } from "../bricks/HeartBrick";
import { HandBrick } from "../bricks/HandBrick";
import { serializable } from "@/system/Serialization";
import { BagBrick } from "../bricks/BagBrick";
import { LargeBagBrick } from "../bricks/LargeBagBrick";
import { StickItem } from "../items/StickItem";
import { SwordItem } from "../items/SwordItem";

export @serializable('fighter.collector') class Collector extends Fighter {
	name = 'Collector';
	image = Image;
	color = new Color(0x23674e);

	controllable: boolean = true;

	constructor() {
		super();

		this.bricks.addAll(
			new HeartBrick().set({ health: 5, maxHealth: 5 }),
			new HandBrick().set({ health: 3, maxHealth: 3 }),
			new BagBrick().set({ health: 3, maxHealth: 3 }),
			new LargeBagBrick().set({ health: 3, maxHealth: 3 }).transform(b => {
				b.inventory.values()[0].placeItem(new StickItem())
				b.inventory.values()[1].placeItem(new SwordItem())
			}),
		)
	}
}