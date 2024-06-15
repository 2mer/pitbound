import { Fighter } from "@/types/Fighter";
import Image from '../../assets/icons/fighter/pitling.png';
import Color from "color";
import { Brick } from "@/types/Brick";
import { LegBrick } from "../bricks/LegBrick";
import { HeartBrick } from "../bricks/HeartBrick";
import { ClawBrick } from "../bricks/ClawBrick";
import { serializable } from "@/system/Serialization";
import { CharacterController } from "@/types/CharacterController";
import { FleeAbility } from "../abilities/FleeAbility";
import { Intent } from "@/types/CharacterIntent";
import { ScratchAbility } from "../abilities/ScratchAbility";

export @serializable('fighter.pitling') class Pitling extends Fighter {
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

		this.controller = new PitlinController();
	}
}

export @serializable('pitlin.ai') class PitlinController extends CharacterController {
	createIntent() {
		const intent = new Intent();

		const [leg, heart, claw] = this.fighter.bricks.$$(LegBrick, HeartBrick, ClawBrick);

		if (Brick.canUseBrick(claw)) {

			const [hitAbility] = claw.abilities.$$(ScratchAbility);

			const rEnemy = this.getRandomEnemy();
			if (rEnemy) {
				intent.harmful({
					origin: claw,
					target: rEnemy,
					act() {
						hitAbility.tryUseOn(rEnemy)
					}
				})
			}

		}

		if (heart?.health <= 3 && Brick.canUseBrick(leg)) {
			const [flee] = leg.abilities.$$(FleeAbility);

			flee?.tryUse();
		}

		return intent;
	}
}