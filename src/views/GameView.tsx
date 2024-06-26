import StageComponent from '@/components/StageComponent';
import useSaveSlot from '@/hooks/useSaveSlot';
import Serialization from '@/system/Serialization';
import { Stage } from '@/types/Stage';
import { useMemo } from 'react';

function GameView() {
	const saveSlot = useSaveSlot();

	const stage = useMemo(() => {
		if (!saveSlot) return;

		return Serialization.deserialize<Stage>(JSON.parse(saveSlot.data));
	}, [saveSlot]);

	if (!stage) return null;

	return <StageComponent stage={stage} />;
}

export default GameView;
