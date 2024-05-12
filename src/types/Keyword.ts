import Color from "color";
import { Component } from "./Component";

export class Keyword<T> extends Component<T> {
	name = 'Keyword';
	color = new Color(0xFFFFFF);
	description = 'description';


	getDescription() {
		return this.description;
	}
}