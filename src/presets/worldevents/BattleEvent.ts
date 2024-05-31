import { serializable } from "@/system/Serialization";
import { FighterEvent } from "./FighterEvent";

export @serializable('worldEvent.battle') class BattleEvent extends FighterEvent {
	name = 'Battle';
	isBlocking = true;
}