import { Fighter } from "@/types/Fighter";
import Image from '../../assets/icons/fighter/dev.png';
import Color from "color";
import { HandBrick } from "../bricks/HandBrick";

export class Dev extends Fighter {
	name = 'Dev';
	image = Image;
	color = new Color(0xa6fcdb);

	constructor() {
		super();

		this.bricks.addAll(
			new HandBrick().set({ health: 7, maxHealth: 7 }),
		)
	}
}