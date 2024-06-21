import { serializable } from "@/system/Serialization";
import { Nested } from "./Nested";
import type { Fighter } from "./Fighter";
import { R3, randomEntry } from "@/utils/PRandom";
import { Intent } from "./CharacterIntent";

export @serializable('characterController') class CharacterController extends Nested<Fighter> {

	intent: Intent = Intent.EMPTY;

	get fighter() {
		return this.parent!;
	}

	get stage() {
		return this.fighter.stage;
	}

	createIntent(): Intent {
		return Intent.EMPTY;
	}

	prepare() {
		this.intent = this.createIntent();
	}

	playTurn() {
		this.intent.act();
	};

	getRandomEnemy() {
		const { event } = this.parent!;
		const { turn } = this.stage;
		const idx = event.fighters.values().indexOf(this.fighter);

		const enemies = this.stage.getEnemies(this.fighter).filter(e => e.isAlive() && !e.hasFled);

		const r = R3(turn, idx, this.stage.world.age);

		return randomEntry(enemies, r);
	}

}