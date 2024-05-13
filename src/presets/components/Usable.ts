import { Component } from "@/types/Component";
import { Fighter } from "@/types/Fighter";
import { Stage } from "@/types/Stage";

export class Usable<T> extends Component<T> {
	uses = 1;
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
		this.closest(Fighter)!.update();
	}

	onAdded(target: T): void {
		super.onAdded(target);

		this.closest(Stage)!.events.on('turnStart', this.onTurnStart, this)
	}

	onRemoved(target: T): void {
		super.onAdded(target);

		this.closest(Stage)!.events.off('turnStart', this.onTurnStart, this)
	}
}