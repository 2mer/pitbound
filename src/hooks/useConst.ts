import { useRef } from "react";

const Unset = Symbol('unset');

export default function useConst<T>(create: () => T) {

	const ref = useRef<T | typeof Unset>(Unset);
	if (ref.current === Unset) {
		ref.current = create();
	}

	return ref.current as T;

}