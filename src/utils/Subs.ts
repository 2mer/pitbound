import EventEmitter from "eventemitter3";

type ExtractEvents<T extends EventEmitter<any>> = T extends EventEmitter<infer R> ? R : never;

export function subs<T extends EventEmitter<any>>(emitter: T, handlers: Partial<ExtractEvents<T>>) {

	const cleanups: (() => void)[] = [];

	Object.entries(handlers).forEach(([event, handler]) => {
		emitter.on(event, handler);

		cleanups.push(() => {
			emitter.off(event, handler);
		})
	})

	return () => {
		cleanups.forEach(c => {
			c();
		})
	}
}