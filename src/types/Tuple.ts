export function Tuple<T extends [any, ...any]>(...values: T) {
	return values;
}