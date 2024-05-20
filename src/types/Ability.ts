import { Brick } from "./Brick";
import { Component, ComponentSystem } from "./Component";
import { Keyword } from "./Keyword";
import { Nested } from "./Nested";
import Icon from '@/assets/icons/brick/unknown.png';

export class Ability<T> extends Nested<T> {
	name = 'Ability';
	description = '';
	image = Icon;

	keywords = new ComponentSystem<Keyword<Ability<T>>>();
	components = new ComponentSystem<Component<Ability<T>>>();

	cost?: (typeof Brick)[]

	related = [
		this.keywords
	] as Nested<this>[]

	canClick() {
		return false;
	}

	onClick() {

	}

	getDescription() {
		return this.description;
	}
}