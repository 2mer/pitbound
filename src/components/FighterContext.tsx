import { Fighter } from '../types/Fighter';
import { createContext } from '@sgty/kontext-react';
import useConst from '@/hooks/useConst';

export const FighterContext = createContext(
	({ fighter }: { fighter: Fighter }) => {
		return useConst(() => fighter);
	}
);
