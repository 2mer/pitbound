import Color from "color";
import { Brick } from "../../types/Brick";
import Icon from '@/assets/icons/brick/heart.png';
import { EssentialKeyword } from "../keywords/brick/EssentialKeyword";


export class HeartBrick extends Brick {
	name = 'Heart';
	image = Icon;
	color = new Color(0xFF0000);

	constructor() {
		super();

		this.keywords.addChild(new EssentialKeyword());
	}


	public onClick(): void {
		this.fighter.bricks.values().forEach(b => b.heal({ healer: this.fighter, amount: this.level }))
	}

	public getWidth(): number {
		return this.level * this.width;
	}

}