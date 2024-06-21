import useEventListener from '@/hooks/useEventListener';
import { useForceUpdate } from '@/hooks/useForceUpdate';
import type { Slot } from '@/types/Slot';
import { Stage } from '@/types/Stage';
import { playSound } from '@/utils/SoundPlayer';
import { twJoin } from 'tailwind-merge';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { useState } from 'react';

function SlotComponent({ slot }: { slot: Slot }) {
	const update = useForceUpdate();

	const stage = slot.closest(Stage)!;
	const cursorSlot = stage.cursor.slot;

	useEventListener(slot.events, 'itemPlaced', update);
	useEventListener(slot.events, 'itemRemoved', update);
	useEventListener(cursorSlot.events, 'itemPlaced', update);
	useEventListener(cursorSlot.events, 'itemRemoved', update);

	const canClick = [slot, cursorSlot].some((slot) => !slot.isEmpty());

	const [tooltipOpen, setTooltipOpen] = useState(false);

	return (
		<Tooltip
			open={tooltipOpen && !slot.isEmpty()}
			onOpenChange={setTooltipOpen}
		>
			<TooltipTrigger asChild>
				<div
					role='button'
					aria-disabled={!canClick}
					className={twJoin(
						'bg-black ring-inset ring-unit ring-purple-950 hover:ring-purple-800 transition-all duration-200',
						canClick ? 'cursor-pointer' : 'cursor-auto'
					)}
					onClick={() => {
						if (!canClick) return;

						slot.swapSlot(cursorSlot);

						playSound('click');
					}}
				>
					{slot.isEmpty() ? (
						<div className='w-[32px] h-[32px]' />
					) : (
						<img
							src={slot.item.icon}
							className='w-[32px] h-[32px] rendering-pixelated'
							style={{
								filter: `drop-shadow(1px 0 0 black) drop-shadow(-1px 0 0 black) drop-shadow(0 1px 0 black) drop-shadow(0 -1px 0 black) drop-shadow(0 0 4px ${slot.item.rarity.color.hex()})`,
							}}
						/>
					)}
				</div>
			</TooltipTrigger>
			<TooltipContent>
				<div style={{ color: slot.item.rarity.color.hex() }}>
					{slot.item.name}
				</div>
			</TooltipContent>
		</Tooltip>
	);
}

export default SlotComponent;
