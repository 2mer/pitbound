import { Stage } from '../types/Stage';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';
import { TargetingContext } from './TargetingContext';
import useEventListener from '@/hooks/useEventListener';
import { useForceUpdate } from '@/hooks/useForceUpdate';
import { cn } from '@/lib/utils';
import WorldEventComponent from './WorldEventComponent';
import TargetingIndicator from './TargetingIndicator';
import { AnimatePresence, motion } from 'framer-motion';
import IconButton from './IconButton';
import MapIcon from '@/assets/icons/ui/map.png';
import BagIcon from '@/assets/icons/brick/bag.png';
import BagOpenIcon from '@/assets/icons/brick/bagOpen.png';
import SettingsIcon from '@/assets/icons/ui/settings.png';
import NodeMapComponent from './NodeMapComponent';
import { StagePixiOverlay } from './StagePixiOverlay';
import { StageContext } from './StageContext';
import useSWRMutation from 'swr/mutation';
import InventoryContext from './InventoryContext';
import { useHotkeys } from '@mantine/hooks';
import CursorComponent from './CursorComponent';
import ScrollContext from './ScrollContext';

export function useTurns(stage: Stage) {
	const nextTurnAction = useSWRMutation('next-turn', () => stage.endTurn());

	return { nextTurnAction };
}

function StageComponent({ stage }: { stage: Stage }) {
	const [mapOpen, setMapOpen] = useState(false);
	const [inventoryOpen, setInventoryOpen] = InventoryContext.use();

	const { nextTurnAction } = useTurns(stage);

	useHotkeys([
		[
			'Escape',
			() => {
				setMapOpen(false);
				setInventoryOpen(false);

				if (stage.targeting) {
					stage.stopTargeting();
				}
			},
		],
		['m', () => setMapOpen((o) => !o)],
		['i', () => setInventoryOpen((o) => !o)],
		['b', () => setInventoryOpen((o) => !o)],
		[
			'space',
			() => {
				if (stage.world.canMove()) {
					setMapOpen((o) => !o);
				} else {
					if (!nextTurnAction.isMutating) {
						nextTurnAction.trigger();
					}
				}
			},
		],
	]);

	const update = useForceUpdate();
	useEventListener(stage.events, 'update', update);
	useEventListener(stage.cursor.slot.events, 'itemPlaced', update);
	useEventListener(stage.cursor.slot.events, 'itemRemoved', update);

	const isTargeting = Boolean(stage.targeting);

	useEffect(() => {
		if (!isTargeting) return;

		function handleEsc(e: KeyboardEvent) {
			if (stage.targeting && e.key === 'Escape') {
				stage.targeting.onCancel?.();
				stage.stopTargeting();
			}
		}

		document.body.addEventListener('keydown', handleEsc);

		return () => {
			document.body.removeEventListener('keydown', handleEsc);
		};
	}, [stage, isTargeting]);

	useEffect(() => {
		setMapOpen(false);
	}, [stage.world.position]);

	const { ref: scrollRef } = ScrollContext.use();

	return (
		<StagePixiOverlay.Provider>
			<StageContext.Provider stage={stage}>
				<TargetingContext.Provider targeting={stage.targeting}>
					<div
						className='flex flex-col h-[100vh] w-[100vw]'
						style={{ background: stage.background }}
					>
						{/* action bar */}
						<div className=' bg-black text-white w-full p-unit-4 grid grid-cols-3 font-barlow items-center'>
							<div className='justify-self-start'>
								{mapOpen ? (
									<span>W+{stage.world.age}</span>
								) : (
									<span>T+{stage.turn}</span>
								)}
							</div>
							<div className='justify-self-center text-center'>
								{stage.world.position.depth}m
							</div>
							<div className='justify-self-end flex gap-unit-4'>
								<IconButton
									icon={inventoryOpen ? BagOpenIcon : BagIcon}
									onClick={() => setInventoryOpen((p) => !p)}
									tooltip={'Inventory (I/B)'}
								/>
								<IconButton
									icon={MapIcon}
									onClick={() => setMapOpen((p) => !p)}
									tooltip={'Map (M)'}
								/>
								<IconButton
									icon={SettingsIcon}
									onClick={() => {}}
									tooltip={'Options (O)'}
								/>
							</div>
						</div>

						{/* stage content */}
						<motion.div
							layoutId='stageContent'
							className='flex-1 min-h-0 relative'
						>
							<div
								ref={scrollRef}
								className={cn(
									'h-full w-full relative overflow-auto',
									!stage.cursor.slot.isEmpty() && 'noCursor'
								)}
								style={{ scrollbarGutter: 'stable' }}
							>
								{/* events grid */}
								<div
									className={cn(
										'grid grid-cols-[1fr_auto_1fr] justify-center gap-[calc(theme(size.unit)*12)] p-[calc(theme(size.unit)*10)] flex-1 w-full min-h-full items-center relative'
									)}
								>
									<div
										className={cn(
											'absolute inset-0 z-[-1] transition-all duration-500',
											isTargeting &&
												// 'before:absolute before:inset-0 before:backdrop-blur-md before:backdrop-hue-rotate-90'
												'hue-rotate-90 brightness-[0.2]'
										)}
										style={
											{
												// filter: isTargeting
												// 	? 'hue-rotate(90deg) blur(20px)'
												// 	: '',
											}
										}
									/>

									<WorldEventComponent
										worldEvent={stage.world.leftEvent}
									/>

									<div className='flex self-stretch border-l-unit border-black border-opacity-20' />

									<WorldEventComponent
										worldEvent={stage.world.rightEvent}
									/>

									<StagePixiOverlay.Canvas className='absolute inset-0 w-full h-full pointer-events-none' />
								</div>

								<TargetingIndicator />
							</div>
							<AnimatePresence>
								{mapOpen && (
									<motion.div
										className='absolute inset-0'
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
									>
										<NodeMapComponent
											PixiProps={{
												className: 'w-full h-full',
											}}
										/>
									</motion.div>
								)}
							</AnimatePresence>
						</motion.div>

						<div className='flex justify-end bg-black text-white w-full p-unit-4'>
							<div className='flex justify-end'>
								{stage.world.canMove() ? (
									<Button
										variant={'secondary'}
										className={cn(
											!mapOpen && 'animate-bounce'
										)}
										disabled={mapOpen}
										onClick={() => {
											setMapOpen(true);
										}}
									>
										Leave
									</Button>
								) : (
									<Button
										variant={'secondary'}
										disabled={nextTurnAction.isMutating}
										onClick={() => {
											nextTurnAction.trigger();
										}}
									>
										End Turn
									</Button>
								)}
							</div>
						</div>
					</div>

					<CursorComponent cursor={stage.cursor} />
				</TargetingContext.Provider>
			</StageContext.Provider>
		</StagePixiOverlay.Provider>
	);
}

export default ScrollContext.wrap(InventoryContext.wrap(StageComponent));
