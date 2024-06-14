import { serializable, serialize } from "@/system/Serialization";
import { Brick } from "./Brick";
import { Component, ComponentSystem } from "./Component";
import { Keyword } from "./Keyword";
import { Nested, related } from "./Nested";
import Icon from '@/assets/icons/brick/unknown.png';
import { INestFighter } from "./INest";

export @serializable('ability') class Ability<T extends INestFighter> extends Nested<T> implements INestFighter {
	@serialize name = 'Ability';
	description = '';
	image = Icon;

	@serialize @related keywords = new ComponentSystem<Keyword<Ability<T>>>();
	@serialize @related components = new ComponentSystem<Component<Ability<T>>>();

	cost?: (typeof Brick)[]

	canUse() {
		return false;
	}

	onUse() {

	}

	tryUse() {
		console.log('egg', this.canUse())
		if (this.canUse()) {
			this.onUse();
			return true;
		}

		return false;
	}

	tryUseOn(target: T) {
		const used = this.tryUse();
		console.log('try use', used)
		if (used) {
			const stage = this.parent!.stage;
			console.log('stage', stage)
			if (!stage.targeting) return false;

			stage.targeting.onTarget(target);
		}

		return used;
	}

	getDescription() {
		return this.description;
	}

	getImage() {
		return this.image;
	}

	get fighter() {
		return this.parent!.fighter;
	}

	get stage() {
		return this.parent!.stage;
	}
}