import { serializable, serialize } from "@/system/Serialization";
import EventEmitter from "eventemitter3";

const RelatedSymbol = Symbol('related');

type KeysWithValuesOfType<T, R> = {
	[K in keyof T]: T[K] extends R ? K : never
}[keyof T];

export function related<T extends Nested<any>>(target: T, key: KeysWithValuesOfType<T, Nested<any>>) {
	// @ts-ignore
	target[RelatedSymbol] ??= [];
	// @ts-ignore
	target[RelatedSymbol] = [...target[RelatedSymbol], key];
}

export class Nested<TParent> {
	parent?: TParent;

	isAdded = false;

	get related(): Nested<this>[] {
		// @ts-ignore
		return (this[RelatedSymbol] ?? []).map(key => this[key]);
	}

	onAdded(p: TParent) {
		this.parent = p;
		this.isAdded = true;

		const related = this.related;

		if (related) {
			this.related.forEach(r => {
				r.onAdded(this);
			});
		}
	}

	onRemoved(_: TParent) {
		if (this.related) {
			this.related.forEach(r => r.onRemoved(this));
		}

		this.parent = undefined;
		this.isAdded = false;
	}

	closest<C extends abstract new (...args: any) => any>(clzz: C): InstanceType<C> | undefined {
		if (!this.parent) return undefined;

		if ((this.parent as any) instanceof clzz) {
			return this.parent as InstanceType<C>;
		}

		if (this.parent instanceof Nested) {
			return this.parent.closest(clzz)
		}

		return undefined;
	}

	// util

	transform(cb: (v: this) => void) {
		cb(this);
		return this;
	}

	public set<T extends Partial<this>>(data: T) {
		Object.assign(this, data);

		return this;
	}
}

type NestedParent<T extends Nested<any>> = T extends Nested<infer R> ? R : never;


export type ChildrenEvents<T extends Nested<any>> = {
	childAdded: (c: T) => void;
	childRemoved: (c: T) => void;
}

export @serializable('children') class Children<T extends Nested<any>> extends Nested<NestedParent<T>> {
	events = new EventEmitter<ChildrenEvents<T>>();

	@serialize
	items: T[] = [];

	addAll(...items: T[]) {
		items.forEach(i => this.addChild(i));
	}

	swap(a: T, b: T) {
		const i = this.items.indexOf(a);

		if (i > -1) {
			if (this.isAdded) {
				a.onRemoved(this.parent);
				this.events.emit('childRemoved', a);
			}

			this.items[i] = b;

			if (this.isAdded) {
				b.onAdded(this.parent);
				this.events.emit('childAdded', b);
			}
		}
	}

	addChild<C extends T>(item: C) {
		if (this.isAdded) {
			item.onAdded(this.parent);
		}

		this.items.push(item);
		this.events.emit('childAdded', item);

		return item;
	}

	removeChild(item: T) {
		if (this.isAdded) {
			item.onRemoved(this.parent);
			this.events.emit('childRemoved', item);
		}

		this.items.splice(this.items.indexOf(item), 1);
	}

	clear() {
		this.items.forEach(item => item.onRemoved(this.parent));
		this.items = [];
	}

	values() {
		return this.items;
	}

	hasChild(item: T) {
		return this.items.includes(item);
	}

	onAdded(p: NestedParent<T>): void {
		super.onAdded(p);

		this.items.forEach(item => item.onAdded(p));
	}

	onRemoved(p: NestedParent<T>): void {
		this.items.forEach(item => item.onRemoved(p));

		super.onRemoved(p);

	}

	isEmpty() {
		return !(this.items.length);
	}

	setChildren(children: T[]) {
		this.clear();
		this.addAll(...children)
	}

	effect(cb: (c: T) => (void | (() => void))) {
		this.events.on('childAdded', c => {
			const cleanup = cb(c);

			if (cleanup) {
				const handleRemove = (_c: T) => {
					if (c === _c) {
						cleanup();
						this.events.off('childRemoved', handleRemove);
					}
				}

				this.events.on('childRemoved', handleRemove)
			}
		})
	}
}