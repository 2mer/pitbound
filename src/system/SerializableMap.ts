import { serializable, serialize } from "./Serialization";

@serializable('map.entry') class SerializableClassEntry<T, R> {
	@serialize
	key?: T;

	@serialize
	value?: R;
}

export @serializable('map') class SerializableMap<T, R> extends Map<T, R> {

	@serialize
	get _entries() {
		return [...this.entries()].map(e => {
			const nE = new SerializableClassEntry<T, R>();
			nE.key = e[0];
			nE.value = e[1];
			return nE;
		})
	}

	set _entries(value) {
		value.forEach(e => {
			this.set(e.key!, e.value!);
		})
	}

}