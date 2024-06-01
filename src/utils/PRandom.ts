import { vec2, vec3 } from 'gl-matrix'
import { fract, mix } from './Math';

export function R2(n1: number, n2: number) {

	return Math.abs(fract(
		Math.sin(
			vec2.dot(
				vec2.fromValues(n1, n2),
				vec2.fromValues(12.9898, 78.233)
			)
		) *
		43758.5453123
	));
}

export function R1(n1: number) {
	return R2(n1, -2342.5975)
}

export function R3(n1: number, n2: number, n3: number) {
	return Math.abs(fract(
		Math.sin(
			vec3.dot(
				vec3.fromValues(n1, n2, n3),
				vec3.fromValues(12.9898, 78.233, 59.2849)
			)
		) *
		32179.5453123
	));
}

export function weightedRandom(random: number, weights: number[]): number {
	// Normalize the weights to sum to 1
	const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
	const normalizedWeights = weights.map(weight => weight / totalWeight);

	// Create a cumulative distribution
	const cumulativeWeights: number[] = [];
	for (let i = 0; i < normalizedWeights.length; i++) {
		cumulativeWeights[i] = normalizedWeights[i] + (cumulativeWeights[i - 1] || 0);
	}

	// Find the index corresponding to the random number
	for (let i = 0; i < cumulativeWeights.length; i++) {
		if (random < cumulativeWeights[i]) {
			return i;
		}
	}

	// In case of rounding errors, return the last index
	return cumulativeWeights.length - 1;
}

export const V = {

	R2(v: vec2) {
		return R2(v[0], v[1]);
	},

	R22(st: vec2) {
		st = V.from(V.dot(st, V.from(127.1, 311.7)),
			V.dot(st, V.from(269.5, 183.3)));

		return V.add(V.N(-1.0), V.muln(V.fract(V.muln(V.sin(st), 43758.5453123)), 2.0));
	},

	apply(st: vec2, fn: (n: number) => number) {
		return vec2.fromValues(fn(st[0]), fn(st[1]))
	},

	sin(st: vec2) {
		return V.apply(st, Math.sin)
	},

	fract(st: vec2) {
		return V.apply(st, fract);
	},

	floor(st: vec2) {
		return vec2.floor(vec2.create(), st)
	},

	N(n: number) {
		return vec2.fromValues(n, n);
	},

	mix(v1: vec2, v2: vec2, p: number) {
		return vec2.fromValues(
			mix(v1[0], v2[0], p),
			mix(v1[1], v2[1], p),
		)
	},

	mul(v1: vec2, v2: vec2) {
		return vec2.mul(vec2.create(), v1, v2);
	},

	muln(v1: vec2, n: number) {
		return V.mul(v1, V.N(n));
	},

	from(n1: number, n2: number) {
		return vec2.fromValues(n1, n2);
	},

	empty() {
		return vec2.create();
	},

	add(v1: vec2, v2: vec2) {
		return vec2.add(vec2.create(), v1, v2);
	},

	sub(v1: vec2, v2: vec2) {
		return vec2.sub(vec2.create(), v1, v2);
	},

	dot(v1: vec2, v2: vec2) {
		return vec2.dot(v1, v2);
	},

	perlinNoise(st: vec2) {

		const i = V.floor(st);
		const f = V.fract(st);


		const u = V.mul(V.mul(f, f), V.sub(V.from(3.0, 3.0), V.mul(f, V.from(2, 2))));

		return mix(mix(V.dot(V.R22(V.add(i, V.from(0.0, 0.0))), V.sub(f, V.from(0.0, 0.0))),
			V.dot(V.R22(V.add(i, V.from(1.0, 0.0))), V.sub(f, V.from(1.0, 0.0))), u[0]),
			mix(V.dot(V.R22(V.add(i, V.from(0.0, 1.0))), V.sub(f, V.from(0.0, 1.0))),
				V.dot(V.R22(V.add(i, V.from(1.0, 1.0))), V.sub(f, V.from(1.0, 1.0))), u[0]), u[1]);

	}

}

export function randomEntry<T extends any[]>(arr: T, r: number): T[number] {
	return arr[Math.round(r * (arr.length - 1))]
}