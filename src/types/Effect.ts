import { serializable } from "@/system/Serialization";
import { Component } from "./Component";

export @serializable('effect') class Effect<T> extends Component<T> {
}