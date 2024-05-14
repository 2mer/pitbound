import { Targeting } from '@/types/Targeting';
import { createContext } from '@sgty/kontext-react';
import { useEffect, useMemo, useRef } from 'react';

export const TargetingContext = createContext(
	({ targeting }: { targeting?: Targeting<any> }) => {
		return useMemo(() => targeting, [targeting]);
	}
);

export function useTargeting<T>(value: T) {
	const targeting = TargetingContext.use();

	const ref = useRef<HTMLElement>(null);

	const isTargetable = useMemo(() => {
		if (!targeting) return false;
		if (!value) return;

		return targeting.canTarget(value);
	}, [targeting, value]);

	useEffect(() => {
		if (isTargetable) {
			const el = ref.current!;

			function handleClick(e: MouseEvent) {
				e.stopPropagation();

				targeting!.onTarget(value);
			}

			el.addEventListener('click', handleClick);

			return () => {
				el.removeEventListener('click', handleClick);
			};
		}
	}, [isTargetable]);

	return [ref, { isTargetable, isTargeting: Boolean(targeting) }] as const;
}
