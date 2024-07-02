import { Brick } from '../types/Brick';
import { createContext } from '@sgty/kontext-react';
import { useMemo } from 'react';

export const BrickContext = createContext(({ brick }: { brick: Brick }) =>
	useMemo(() => brick, [brick])
);
