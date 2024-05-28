import { vec2 } from 'gl-matrix'
import { fract } from './Math';

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