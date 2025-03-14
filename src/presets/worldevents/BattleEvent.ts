import { serializable } from "@/system/Serialization";
import { FighterEvent } from "./FighterEvent";
import Color from "color";
import Icon from '@/assets/icons/ui/fight.png';
import { Assets } from "pixi.js";

Assets.load(Icon);

export @serializable('worldEvent.battle') class BattleEvent extends FighterEvent {
	name = 'Battle';
	color = new Color(0xFF0000);
	image = Icon;

	init(): void {
		super.init();

		this.events.on('allFightersDead', () => {
			this.world.persist(this);
		})
	}


	isComplete(): boolean {
		return !this.isBlocking();
	}

	onVisit(): void {
		this.stage.startTurn();
		this.world.persist(this);
	}
}

