import { FighterEvent } from '@/presets/worldevents/FighterEvent';
import { WorldEvent } from '@/types/WorldEvent';
import FighterEventComponent from './worldevents/FighterEventComponent';

function WorldEventComponent({ worldEvent }: { worldEvent: WorldEvent }) {
	if (worldEvent instanceof FighterEvent) {
		return <FighterEventComponent worldEvent={worldEvent} />;
	}

	return null;
}

export default WorldEventComponent;
