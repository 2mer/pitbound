import { serializable } from "@/system/Serialization";
import { WorldEvent } from "@/types/WorldEvent";

export @serializable('worldEvent.emptyEvent') class EmptyEvent extends WorldEvent {
	name = 'Empty';
}