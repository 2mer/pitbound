import { Fighter } from "@/types/Fighter";
import Image from '../../assets/icons/fighter/pitling.png';
import Color from "color";
import { LegBrick } from "../bricks/LegBrick";
import { HeartBrick } from "../bricks/HeartBrick";
import { ClawBrick } from "../bricks/ClawBrick";

export class Pitling extends Fighter {
	name = 'Pitling';
	image = Image;
	color = new Color(0xc18061);
	width = 12 * 4;

	constructor() {
		super();

		this.bricks.addAll(
			new LegBrick().set({ health: 3, maxHealth: 3 }),
			new HeartBrick().set({ health: 5, maxHealth: 5, color: new Color(0x7d2e4d) }),
			new ClawBrick().set({ health: 3, maxHealth: 3, attack: 1, color: new Color(0xdba463) }),
		)
	}
}