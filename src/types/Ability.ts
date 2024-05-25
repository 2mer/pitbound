import { serializable, serialize } from "@/system/Serialization";
import { Brick } from "./Brick";
import { Component, ComponentSystem } from "./Component";
import { Keyword } from "./Keyword";
import { Nested, related } from "./Nested";
import Icon from '@/assets/icons/brick/unknown.png';

export @serializable('ability') class Ability<T> extends Nested<T> {
	@serialize name = 'Ability';
	description = '';
	image = Icon;

	@serialize @related keywords = new ComponentSystem<Keyword<Ability<T>>>();
	@serialize @related components = new ComponentSystem<Component<Ability<T>>>();

	cost?: (typeof Brick)[]

	canClick() {
		return false;
	}

	onClick() {

	}

	getDescription() {
		return this.description;
	}

	getImage() {
		return this.image;
	}
}