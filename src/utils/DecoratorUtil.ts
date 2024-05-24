export function createConstuctorMeta<T>(getDefault: () => T) {
	const constructorMeta = new Map<any, T>();
	return {
		getOrCreateMeta(ctr: any) {
			if (!constructorMeta.has(ctr)) {
				constructorMeta.set(ctr, getDefault());
			}

			return constructorMeta.get(ctr)!;
		}
	}
}