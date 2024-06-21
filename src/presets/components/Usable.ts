import { serializable, serialize } from "@/system/Serialization";
import { Component } from "@/types/Component";
import type { INestFighter, INestStage } from "@/types/INest";

export @serializable('component.usable') class Usable<T extends INestStage & INestFighter> extends Component<T> {
	@serialize
	uses = 1;
	@serialize
	baseUses = 1;

	public use() {
		this.uses--;
	}

	public canUse() {
		return this.uses > 0;
	}

	public reset() {
		this.uses = this.baseUses;
	}

	public onTurnStart() {
		this.reset();
		this.parent!.fighter.update();
	}

	onAdded(target: T): void {
		super.onAdded(target);

		this.parent!.stage.events.on('turnStart', this.onTurnStart, this)
	}

	onRemoved(target: T): void {
		this.parent!.stage.events.off('turnStart', this.onTurnStart, this)

		super.onAdded(target);
	}
}