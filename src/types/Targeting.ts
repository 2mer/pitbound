import { Ability } from "./Ability";

export interface Targeting<T> {
	canTarget(target: T): boolean;

	onTarget(target: T): void;

	onCancel?: () => void;

	ability?: Ability<any>;
}

export function Targeting<T>(v: Targeting<T>) {
	return v;
}