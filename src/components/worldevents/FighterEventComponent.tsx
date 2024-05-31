import { FighterEvent } from '@/presets/worldevents/FighterEvent';
import { motion } from 'framer-motion';
import FighterComponent from '../FighterComponent';
import { cn } from '@/lib/utils';

function FighterEventComponent({ worldEvent }: { worldEvent: FighterEvent }) {
	const isFlipped = worldEvent.side === 'RIGHT';

	return (
		<motion.div
			className={cn(
				'flex flex-col gap-[calc(theme(size.unit)*4)]',
				isFlipped ? 'items-start' : 'items-end'
			)}
		>
			{worldEvent.fighters.values().map((f) => (
				<FighterComponent key={f.id} fighter={f} flipped={isFlipped} />
			))}
		</motion.div>
	);
}

export default FighterEventComponent;
