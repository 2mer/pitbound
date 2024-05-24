import { serializable, serialize } from "@/system/Serialization";
import { Component } from "@/types/Component";

export @serializable('component.attacker') class Attacker extends Component<any> {
	@serialize
	attack = 1;
}