import { Fighter } from '../types/Fighter';
import { createContext } from '@sgty/kontext-react';
import { useMemo } from 'react';

export const FighterContext = createContext(
	({ fighter }: { fighter: Fighter }) => {
		return useMemo(() => fighter, [fighter]);
	}
);
