import { Fighter } from '../types/Fighter';
import Horizontal from './Horizontal';
import BrickComponent from './BrickComponent';
import { useForceUpdate } from '../hooks/useForceUpdate';
import useEventListener from '../hooks/useEventListener';
import { createContext } from '@sgty/kontext-react';
import useConst from '@/hooks/useConst';
import { AnimatePresence, motion } from 'framer-motion';
import { useTargeting } from './TargetingContext';
import { cn } from '@/lib/utils';

export const FighterContext = createContext(
	({ fighter }: { fighter: Fighter }) => {
		return useConst(() => fighter);
	}
);

function FighterComponent({
	fighter,
	flipped = false,
}: {
	fighter: Fighter;
	flipped?: boolean;
}) {
	const update = useForceUpdate();
	useEventListener(fighter.events, 'update', update);

	const [ref, { isTargeting, isTargetable, isCaster }] =
		useTargeting(fighter);

	return (
		<FighterContext.Provider fighter={fighter}>
			<AnimatePresence>
				{fighter.isAlive() && (
					<motion.div
						layout
						className={cn(
							'flex flex-col group/fighter',
							flipped &&
								'[&_.target-brick-indication]:scale-x-[-1]',

							isTargeting &&
								isTargetable &&
								'targeting-big cursor-pointer',

							isTargeting &&
								!isTargetable &&
								!isCaster &&
								'filter saturate-0 brightness-[25%]',

							isTargeting && isCaster && flipped
								? `ml-[calc(theme('size.unit')*8)]`
								: `mr-[calc(theme('size.unit')*8)]`
						)}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						ref={ref as any}
					>
						<div
							className='p-unit border-solid border-unit border-b-0 bg-black text-white font-barlow justify-center text-center'
							style={{
								borderColor: fighter.color.hex(),
							}}
						>
							{fighter.name}
						</div>
						<div
							className='flex items-start'
							style={{
								flexDirection: flipped
									? 'row-reverse'
									: undefined,
							}}
						>
							<div
								className='bg-black border-unit border-solid border-r-0 box-content relative'
								style={{
									transform: flipped
										? 'scaleX(-1)'
										: undefined,
									borderColor: fighter.color.hex(),
								}}
							>
								<img
									className={cn(
										'rendering-pixelated transition-all duration-200',
										isTargeting &&
											!isTargetable &&
											'opacity-25',
										isTargeting &&
											isTargetable &&
											'cursor-pointer'
									)}
									src={fighter.image}
									style={{
										width: fighter.width,
										height: fighter.height,
									}}
								/>
							</div>

							<Horizontal
								className='bg-black border-solid border-unit p-unit gap-unit'
								style={{
									flexDirection: flipped
										? 'row-reverse'
										: undefined,
									borderColor: fighter.color.hex(),
								}}
							>
								{fighter.bricks.values().map((brick) => {
									// if (brick.isDead()) return null;

									return (
										<BrickComponent
											key={brick.id}
											brick={brick}
										/>
									);
								})}
							</Horizontal>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</FighterContext.Provider>
	);
}

export default FighterComponent;
