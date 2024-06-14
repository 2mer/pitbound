import type { Brick } from "./Brick";
import type { Fighter } from "./Fighter";

export type TargetedIntent = { origin: Brick | Fighter, target: Brick | Fighter, act: () => void };

export type HarmfulIntent = TargetedIntent & { type: 'harmful' };
export type HelpfulIntent = TargetedIntent & { type: 'helpful' };

export type CharacterIntent = HarmfulIntent | HelpfulIntent;

export class Intent {
	intents: CharacterIntent[] = [];

	harmful(intent: TargetedIntent) {
		this.intents.push({ ...intent, type: 'harmful' })
	}

	helpful(intent: TargetedIntent) {
		this.intents.push({ ...intent, type: 'harmful' })
	}

	act() {
		this.intents.forEach(intent => {
			intent.act();
		})
	}

	static EMPTY = new Intent();
}