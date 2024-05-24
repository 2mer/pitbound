import Color from "color";
import { Brick } from "../../types/Brick";
import Icon from '@/assets/icons/brick/heart.png';
import { EssentialKeyword } from "../keywords/brick/EssentialKeyword";
import { serializable } from "@/system/Serialization";


export @serializable('brick.heart') class HeartBrick extends Brick {
	name = 'Heart';
	image = Icon;
	color = new Color(0xFF0000);

	constructor() {
		super();

		this.keywords.addChild(new EssentialKeyword());
	}


	public getWidth(): number {
		return this.level * this.width;
	}

}