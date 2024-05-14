import { EventEmitter } from 'eventemitter3';
import { useEffect } from 'react';

export type EmitterEvents<T extends EventEmitter<any>> = T extends EventEmitter<infer R> ? R : never;

export default function useEventListener<T extends EventEmitter<any>, TEvent extends EventEmitter.EventNames<EmitterEvents<T>>>(emitter: T, event: TEvent, handler: EmitterEvents<T>[TEvent], deps: any[] = []) {
	useEffect(() => {
		emitter.on(event, handler);

		return () => {
			emitter.off(event, handler);
		}
	}, [emitter, event, ...deps])
}