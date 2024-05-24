import { ClassHash } from "@/utils/ClassHash";
import { Children, Nested } from "./Nested";
import { postDeserialize, serializable } from "@/system/Serialization";

export @serializable('component') class Component<TParent> extends Nested<TParent> { }

export @serializable('components') class ComponentSystem<T extends Component<any>> extends Children<T> {
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

	getPattern<C extends typeof Component<any>[]>(pattern: C, filter: ((v: InstanceType<C[number]>) => boolean) = () => true) {
		const clzzToIndex = new Map<Object, number>();

		const res: any[] = [];

		pattern.forEach(clzz => {
			const startIndex = clzzToIndex.get(clzz) ?? 0;

			const vals = this.getAllT(clzz).slice(startIndex);
			const vIndex = vals.findIndex(v => filter(v as unknown as InstanceType<C[number]>));

			if (vIndex > -1) {
				res.push(vals[vIndex]);
			}

			clzzToIndex.set(clzz, vIndex + 1);
		})

		return { ok: (res.length === pattern.length) && res.every(Boolean), hits: res as ClassesToInstances<C> };
	}

	@postDeserialize
	onDeserealize() {
		this.values().forEach(item => {
			this.typeHash.add(item);
		})
	}

	clear(): void {
		super.clear();
		this.typeHash.clear();
	}
}


type ClassesToInstances<T extends [...(abstract new (...args: any) => any)[]]> = { [key in keyof T]: InstanceType<T[key]> } & { length: T['length'] };
