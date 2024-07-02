import { createContext } from '@sgty/kontext-react';
import { Stage } from '../types/Stage';
import { useMemo } from 'react';

export const StageContext = createContext(({ stage }: { stage: Stage }) => {
	return useMemo(() => stage, [stage]);
});
