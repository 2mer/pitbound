import { Nested, related } from "./Nested";
import { Slot } from "./Slot";
import { Stage } from "./Stage";
import { serializable, serialize } from "@/system/Serialization";
import { INestStage } from "./INest";


export @serializable('cursor') class Cursor extends Nested<Stage> implements INestStage {

	@serialize @related slot = new Slot();

	get stage() {
		return this.parent!;
	}
}