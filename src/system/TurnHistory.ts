import { Stage } from "@/types/Stage";

export class TurnHistory {
	entries: Stage[] = [];

	add(stage: Stage) {
		this.entries.push({ ...stage });
	}
}