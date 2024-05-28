export function clamp(n: number, min: number, max: number) {
	return Math.max(min, Math.min(max, n));
}

export function fract(n: number) {
	return n % 1;
}

export function mix(n1: number, n2: number, progress: number) {
	return ((n2 - n1) * clamp(progress, 0, 1)) + n1;
}

export function mixi(n1: number, n2: number, progress: number) {
	return Math.floor(mix(n1, n2, progress));
}