import { Fighter } from "@/types/Fighter";
import Image from '../../assets/icons/fighter/collector.png';
import Color from "color";
import { LegBrick } from "../bricks/LegBrick";
import { HeartBrick } from "../bricks/HeartBrick";
import { HandBrick } from "../bricks/HandBrick";

export class Collector extends Fighter {
	name = 'Collector';
	image = Image;
	color = new Color(0x23674e);

	constructor() {
		super();

		this.bricks.addAll(
			new LegBrick().set({ health: 3, maxHealth: 3 }),
			new HeartBrick().set({ health: 5, maxHealth: 5 }),
			new HandBrick().set({ health: 3, maxHealth: 3 }),
			new HandBrick().set({ health: 3, maxHealth: 3 }),
		)
	}
}