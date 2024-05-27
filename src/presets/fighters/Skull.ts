import { Fighter } from "@/types/Fighter";
import SkullImage from '../../assets/icons/fighter/skull16.png';
import Color from "color";
import { BoneBrick } from "../bricks/BoneBrick";
import { HandBrick } from "../bricks/HandBrick";

export class Skull extends Fighter {
	name = 'Skull';
	image = SkullImage;
	color = new Color(0xFFFFFF);

	constructor() {
		super();

		this.bricks.addAll(
			new BoneBrick().set({ health: 5, maxHealth: 5 }),
			new BoneBrick().set({ health: 5, maxHealth: 5 }),
			new HandBrick().set({ health: 5, maxHealth: 5, color: new Color(0xFFFFFF) }),
			new BoneBrick().set({ health: 5, maxHealth: 5 }),
			new BoneBrick().set({ health: 5, maxHealth: 5 }),
		)
	}
}