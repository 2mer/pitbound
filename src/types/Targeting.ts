import { Ability } from "./Ability";
import { Fighter } from "./Fighter";

export interface Targeting<T> {
	canTarget(target: T): boolean;

	onTarget(target: T): void;

	onCancel?: () => void;

	ability?: Ability<any>;
	caster?: Fighter;

	originEl?: HTMLElement;
}

export function Targeting<T>(v: Targeting<T>) {
	return v;
}