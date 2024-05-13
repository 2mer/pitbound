export class Nested<TParent> {
	parent?: TParent;

	isAdded = false;

	related?: Nested<this>[]

	onAdded(p: TParent) {
		this.parent = p;
		this.isAdded = true;

		if (this.related) {
			this.related.forEach(r => r.onAdded(this));
		}
	}

	onRemoved(p: TParent) {
		this.parent = undefined;
		this.isAdded = false;

		if (this.related) {
			this.related.forEach(r => r.onRemoved(this));
		}
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

export class Children<T extends Nested<any>> extends Nested<NestedParent<T>> {
	items: T[] = [];

	addAll(...items: T[]) {
		items.forEach(i => this.addChild(i));
	}

	addChild<C extends T>(item: C) {
		if (this.isAdded) {
			item.onAdded(this.parent);
		}

		this.items.push(item);
		return item;
	}

	removeChild(item: T) {
		if (this.isAdded) {
			item.onRemoved(this.parent);
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
		super.onRemoved(p);

		this.items.forEach(item => item.onRemoved(p));
	}
}