import { serializable, serialize } from "@/system/Serialization";
import type { WorldPosition } from "./World";

export @serializable('ropeConnection') class RopeConnection {

	@serialize
	from: WorldPosition = { depth: 0, horizontalIndex: 0 };

	@serialize
	to: WorldPosition = { depth: 0, horizontalIndex: 0 };

	public set<T extends Partial<this>>(data: T) {
		Object.assign(this, data);

		return this;
	}
}