import { Brick } from "@/types/Brick";
import { Component } from "@/types/Component";

export class Usable extends Component<Brick> {
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
		this.parent!.fighter.update();
	}

	onAdded(target: Brick): void {
		super.onAdded(target);

		target.stage.events.on('turnStart', this.onTurnStart, this)
	}

	onRemoved(target: Brick): void {
		super.onAdded(target);

		target.stage.events.off('turnStart', this.onTurnStart, this)
	}
}