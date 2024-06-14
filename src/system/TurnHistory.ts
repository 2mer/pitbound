import { Stage } from "@/types/Stage";
import Serialization from "./Serialization";

export class TurnHistory {
	entries: string[] = [];

	add(stage: Stage) {
		this.entries.push(Serialization.serialize(stage));
	}
}