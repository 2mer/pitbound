import { Fighter } from "@/types/Fighter";
import Image from '../../assets/icons/fighter/dev.png';
import Color from "color";
import { HandBrick } from "../bricks/HandBrick";
import { InspectAbility } from "../abilities/InspectAbility";
import { serializable } from "@/system/Serialization";
import { LogStageAbility } from "../abilities/LogStageAbility";
import { LegBrick } from "../bricks/LegBrick";
import { MoveAbility } from "../abilities/MoveAbility";
import { KillAbility } from "../abilities/KillAbility";
import { ExpireAbility } from "../abilities/ExpireAbility";
import type { Brick } from "@/types/Brick";

export @serializable('fighter.dev') class Dev extends Fighter {
	name = 'Dev';
	image = Image;
	color = new Color(0xa6fcdb);

	controllable: boolean = true;

	constructor() {
		super();

		this.bricks.addAll(
			new LegBrick().set({ health: 7, maxHealth: 7 }).transform(b => {
				b.$usable!.set({ uses: Infinity });
				b.abilities.getT(MoveAbility)!.set({ maxDistance: 5 })
				b.abilities.addChild(new ExpireAbility<Brick>())
			}),
			new HandBrick()
				.set({ health: 7, maxHealth: 7 })
				.transform(b => {
					b.$usable!.set({ uses: Infinity });
					b.abilities.addAll(
						new InspectAbility(),
						new LogStageAbility(),
						new KillAbility(),
					)
				}),
		)
	}
}