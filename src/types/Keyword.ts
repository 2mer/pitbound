import Color from "color";
import { Component } from "./Component";
import { serializable, serialize } from "@/system/Serialization";

export @serializable('keyword') class Keyword<T> extends Component<T> {
	@serialize
	name = 'Keyword';
	color = new Color(0xFFFFFF);
	description = 'description';


	getDescription() {
		return this.description;
	}
}