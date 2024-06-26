export default function calc<T extends () => any>(compute: T) {
	return compute();
}