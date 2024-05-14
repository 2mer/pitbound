import styled from 'styled-components';
import { Stage } from '../types/Stage';
import FighterComponent from './FighterComponent';
import { createContext } from '@sgty/kontext-react';
import useConst from '@/hooks/useConst';
import { Button } from './ui/button';
import { playSound } from '@/utils/SoundPlayer';
import { useEffect, useMemo } from 'react';
import { TargetingContext } from './TargetingContext';
import useEventListener from '@/hooks/useEventListener';
import { useForceUpdate } from '@/hooks/useForceUpdate';
import { cn } from '@/lib/utils';
import AbilityComponent from './AbilityComponent';
import { AnimatePresence, motion } from 'framer-motion';

const Scroller = styled.div`
	display: flex;
	justify-content: stretch;
	width: 100%;
	height: 100%;
	align-items: stretch;
`;

export const StageContext = createContext(({ stage }: { stage: Stage }) => {
	return useConst(() => stage);
});

function StageComponent({ stage }: { stage: Stage }) {
	useEffect(() => {
		function handleSpace(e: KeyboardEvent) {
			if (e.key === ' ') {
				stage.endTurn();
			}
		}
		document.addEventListener('keypress', handleSpace);

		return () => {
			document.removeEventListener('keypress', handleSpace);
		};
	}, []);

	const update = useForceUpdate();
	useEventListener(stage.events, 'update', update);

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
	}, [isTargeting]);

	return (
		<StageContext.Provider stage={stage}>
			<TargetingContext.Provider targeting={stage.targeting}>
				<Scroller>
					<div className='grid grid-cols-[1fr_auto_1fr] justify-center gap-[calc(theme(size.unit)*4)] p-[calc(theme(size.unit)*4)] flex-1 w-full items-center relative'>
						<div
							className={cn(
								'absolute inset-0 z-[-1] transition-all duration-200',
								isTargeting &&
									// 'before:absolute before:inset-0 before:backdrop-blur-md before:backdrop-hue-rotate-90'
									'hue-rotate-90 brightness-[0.2]'
							)}
							style={{
								background: stage.background,
								// filter: isTargeting
								// 	? 'hue-rotate(90deg) blur(20px)'
								// 	: '',
							}}
						/>

						<div className='flex flex-col gap-[calc(theme(size.unit)*4)] items-end'>
							{stage.friendly.values().map((f) => (
								<FighterComponent key={f.id} fighter={f} />
							))}
						</div>

						<div className='flex self-stretch border-l-unit border-black border-opacity-20' />

						<div className='flex flex-col gap-[calc(theme(size.unit)*4)] items-start'>
							{stage.hostile.values().map((f) => (
								<FighterComponent
									key={f.id}
									fighter={f}
									flipped
								/>
							))}
						</div>

						{/* actions */}
						<div className='fixed right-0 bottom-0 flex p-unit-4'>
							<Button
								onClick={() => {
									stage.endTurn();
									playSound('click');
								}}
							>
								End Turn
							</Button>
						</div>

						{/* targeting indication */}
						<AnimatePresence>
							{isTargeting && (
								<motion.div
									className='fixed left-0 top-0 flex p-unit pr-unit-4 pointer-events-none bg-black border-solid border-unit border-slate-700 gap-unit-4 m-unit-4 items-center text-white'
									onClick={() => {
										stage.endTurn();
										playSound('click');
									}}
								>
									{stage?.targeting?.ability && (
										<AbilityComponent
											ability={stage?.targeting?.ability}
										/>
									)}

									<div>Choose a target</div>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</Scroller>
			</TargetingContext.Provider>
		</StageContext.Provider>
	);
}

export default StageComponent;
