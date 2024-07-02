import { serializable } from "@/system/Serialization";
import { FighterEvent } from "./FighterEvent";

export @serializable('worldEvent.partyEvent') class PartyEvent extends FighterEvent {
	name = 'Party';

	init(): void {
		super.init();

		this.events.on('allFightersDead', () => this.stage.onLose())
	}
}