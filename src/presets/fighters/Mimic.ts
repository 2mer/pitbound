import { Fighter } from "@/types/Fighter";
import Image from '../../assets/icons/fighter/mimic.png';
import Color from "color";
import { serializable, serialize } from "@/system/Serialization";
import { LargeBagBrick } from "../bricks/LargeBagBrick";
import { HeartBrick } from "../bricks/HeartBrick";
import { CharacterController } from "@/types/CharacterController";
import { Chest } from "./Chest";
import { ClawBrick } from "../bricks/ClawBrick";
import { Intent } from "@/types/CharacterIntent";
import { Brick } from "@/types/Brick";
import { ScratchAbility } from "../abilities/ScratchAbility";

export @serializable('fighter.mimic') class Mimic extends Fighter {
	name = 'Mimic';
	image = Image;
	color = new Color(0x71413b);

	@serialize chest: Chest = new Chest();

	controller: CharacterController = new MimicController();

	constructor() {
		super();

		this.bricks.addAll(
			new HeartBrick().set({ maxHealth: 3, health: 3 }),
			new ClawBrick().set({ maxHealth: 3, health: 3 }),
			new LargeBagBrick().set({ maxHealth: 6, health: 6 }),
		)
	}

	die(): void {
		this.event.swapFighter(
			this,
			this.chest.set({ id: this.id })
		)

		super.die();
	}
}

export @serializable('ai.mimic') class MimicController extends CharacterController {
	createIntent() {
		const intent = new Intent();

		const [claw] = this.fighter.bricks.$$(ClawBrick);

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

		return intent;
	}
}