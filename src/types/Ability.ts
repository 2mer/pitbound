import { Brick } from "./Brick";
import { Component, ComponentSystem } from "./Component";
import { Keyword } from "./Keyword";
import { Nested } from "./Nested";

export class Ability<T> extends Nested<T> {
	name = 'Ability';
	description = '';
	image = '';

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