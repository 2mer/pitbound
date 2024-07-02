import StageComponent from '@/components/StageComponent';
import useSaveSlot from '@/hooks/useSaveSlot';
import Serialization from '@/system/Serialization';
import { Stage } from '@/types/Stage';
import { useMemo } from 'react';

// kind of an ungly hack, but instead of having a huge file where we register every single piece of serializable interface
// we just import all serializable interfaces which then subscribe themselves into the registry
// its not really inneficient because we would have had to import them regardles
//
// we can think about it as if this is some part of a cool framework feature :)
// need to clean up a bit of the folders there to only include registry items
import.meta.glob('../presets/**/*.ts', { eager: true });

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
