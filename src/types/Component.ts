import { ClassHash } from "@/utils/ClassHash";
import { Children, Nested } from "./Nested";

export class Component<TParent> extends Nested<TParent> { }

export class ComponentSystem<T extends Component<any>> extends Children<T> {
	typeHash = new ClassHash<T>();

	addChild<C extends T>(item: C): C {
		super.addChild(item);
		this.typeHash.add(item);
		return item;
	}

	removeChild(item: T): void {
		super.removeChild(item)
		this.typeHash.remove(item as any)
	}

	getT<C extends typeof Component<any>>(clzz: C): InstanceType<C> | undefined {
		return this.typeHash.get(clzz) as any;
	}

	hasT<C extends typeof Component<any>>(clzz: C) {
		return this.typeHash.get(clzz) !== undefined;
	}

	getAllT<C extends typeof Component<any>>(clzz: C): InstanceType<C>[] {
		return this.typeHash.getAll(clzz) as any;
	}

	getPattern<C extends typeof Component<any>[]>(pattern: C): ClassesToInstances<C> {
		const clzzToIndex = new Map<Object, number>();

		const res: any[] = [];

		pattern.forEach(clzz => {
			const index = clzzToIndex.get(clzz) ?? 0;

			res.push(this.getAllT(clzz)?.[index]);

			clzzToIndex.set(clzz, index + 1);
		})

		return res as any;
	}

	clear(): void {
		super.clear();
		this.typeHash.clear();
	}
}


type ClassesToInstances<T extends [...(abstract new (...args: any) => any)[]]> = { [key in keyof T]: InstanceType<T[key]> } & { length: T['length'] };
