import { Brick } from '../types/Brick';
import { createContext } from '@sgty/kontext-react';
import useConst from '@/hooks/useConst';

export const BrickContext = createContext(({ brick }: { brick: Brick }) =>
	useConst(() => brick)
);
