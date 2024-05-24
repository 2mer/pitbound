import { Fighter } from "@/types/Fighter";
import Image from '../../assets/icons/fighter/dev.png';
import Color from "color";
import { HandBrick } from "../bricks/HandBrick";
import { InspectAbility } from "../abilities/InspectAbility";
import { serializable, serialize } from "@/system/Serialization";

export @serializable('fighter.dev') class Dev extends Fighter {
	name = 'Dev';
	image = Image;
	color = new Color(0xa6fcdb);

	@serialize
	test = 5;

	constructor() {
		super();

		this.bricks.addAll(
			new HandBrick()
				.set({ health: 7, maxHealth: 7 })
				.transform(b => {
					b.abilities.addAll(
						new InspectAbility()
					)
				}),
		)
	}
}