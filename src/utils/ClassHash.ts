export class ClassHash<T extends { constructor: any }> {
	hash: Map<Object, T[]> = new Map();

	get(clzz: Object): T | undefined {
		return this.getAll(clzz)?.[0];
	}

	getAll(clzz: Object): T[] {
		return this.hash.get(clzz) ?? [];
	}

	has(clzz: Object) {
		return Boolean((this.hash.get(clzz) ?? []).length);
	}

	add(value: T) {
		const clzz = value.constructor;
		const items = this.getAll(clzz);
		items.push(value);
		this.hash.set(clzz, items);
	}

	remove(value: T) {
		const clzz = value.constructor;
		const items = this.getAll(clzz);
		items.splice(items.indexOf(value), 1);
		this.hash.set(clzz, items);
	}

	clear() {
		this.hash.clear();
	}

}