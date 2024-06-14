import useConst from '@/hooks/useConst';
import { createContext } from '@sgty/kontext-react';
import { Stage } from '../types/Stage';

export const StageContext = createContext(({ stage }: { stage: Stage }) => {
	return useConst(() => stage);
});
