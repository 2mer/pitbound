import { createConstuctorMeta } from "@/utils/DecoratorUtil";
import { mergeWith } from "lodash";

export type SerializationMeta = {
	type: string,
	keys: string[],
	postDeserialize?: string[];
}

export type SerializationDTO = {
	type: string,
	primitive?: { [key: string]: any | any[] };
	complex?: { [key: string]: SerializationDTO | SerializationDTO[] };
}

export function createSerialization() {

	const SerializationSymbol = Symbol('Serialization');
	const idToProto = new Map<string, Function>();
	const protoToId = new Map<Function, string>();
	const { getOrCreateMeta } = createConstuctorMeta<SerializationMeta>(() => ({ type: '', keys: [] }))

	function serialize(object: any): any {
		if (Array.isArray(object)) {
			return object.map(v => serialize(v));
		}


		const meta: SerializationMeta | undefined = object[SerializationSymbol];

		if (!meta) return object;

		if (!meta.keys) throw new Error(`Object has no serialization keys! ` + object.constructor.name)

		const entries = meta.keys.map(k => [k, object[k]]);

		const isComplex = (v: any) => {
			if (Array.isArray(v)) {
				return Boolean(v?.[0]?.[SerializationSymbol])
			}

			return Boolean(v?.[SerializationSymbol])
		}

		const primitiveEntries = entries.filter(([, v]) => !isComplex(v));
		const complexEntries = entries.filter(([, v]) => isComplex(v)).map(([k, v]) => [k, serialize(v)]);

		const serialized: SerializationDTO = { type: meta.type };

		if (primitiveEntries.length) {
			serialized.primitive = Object.fromEntries(primitiveEntries)
		}

		if (complexEntries.length) {
			serialized.complex = Object.fromEntries(complexEntries);
		}

		return serialized;
	};

	function deserialize<T = any>(object: SerializationDTO | SerializationDTO[]): T {
		if (Array.isArray(object)) {
			// @ts-ignore
			return object.map(v => deserialize<any>(v));
		}


		const clzz = idToProto.get(object.type);

		// @ts-ignore;
		const instance = new clzz();

		if (object.primitive) {

			Object.assign(instance, object.primitive);
		}

		if (object.complex) {
			const deserializedComplex = Object.fromEntries(Object.entries(object.complex).map(([k, v]) => [k, deserialize<any>(v as SerializationDTO)]));

			Object.assign(instance, deserializedComplex);
		}

		const meta: SerializationMeta = instance[SerializationSymbol];

		(meta.postDeserialize ?? []).forEach(k => {
			instance[k]();
		})

		return instance as T;
	}

	function mergeCustomizer(objValue: any, srcValue: any) {
		if (Array.isArray(objValue)) {
			return objValue.concat(srcValue);
		}
	}

	return {
		serialize,

		deserialize,

		decorator: {
			serializable(id: string) {
				return function serializable<T extends { new(...args: any[]): any }>(constructor: T) {

					const SerializableClzz = class extends constructor {

						constructor(...args: any[]) {
							super(...args);

							const meta: SerializationMeta = getOrCreateMeta(constructor);

							// @ts-ignore
							this[SerializationSymbol] = mergeWith(this[SerializationSymbol] ?? {}, { ...meta, type: id }, mergeCustomizer)

						}
					}

					idToProto.set(id, SerializableClzz);
					protoToId.set(SerializableClzz, id);

					return SerializableClzz;
				}
			},

			serialize(target: any, propertyKey: string) {
				const meta = getOrCreateMeta(target.constructor);
				meta.keys = [...meta.keys, propertyKey];
			},

			postDeserialize(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
				const meta = getOrCreateMeta(target.constructor);
				meta.postDeserialize ??= [];

				meta.postDeserialize = [...meta.postDeserialize, propertyKey];
			}
		},

		symbol: SerializationSymbol,
	}

}

const Serialization = createSerialization();

export default Serialization;

const { serializable, serialize, postDeserialize } = Serialization.decorator;
export { serializable, serialize, postDeserialize }