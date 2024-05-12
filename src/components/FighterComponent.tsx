import styled, { useTheme } from 'styled-components';
import { Fighter } from '../types/Fighter';
import Horizontal from './Horizontal';
import BrickComponent from './BrickComponent';
import { useForceUpdate } from '../hooks/useForceUpdate';
import useEventListener from '../hooks/useEventEmitter';
import { createContext } from '@sgty/kontext-react';
import useConst from '@/hooks/useConst';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { playSound } from '@/utils/SoundPlayer';

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

	useEffect(() => {
		if (!fighter.isAlive()) {
			playSound('die');
		}
	}, [fighter.isAlive()]);

	return (
		<FighterContext.Provider fighter={fighter}>
			<AnimatePresence>
				{fighter.isAlive() && (
					<motion.div
						className='flex flex-col group/fighter'
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
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
							<img
								className='rendering-pixelated box-content bg-black border-unit border-solid border-r-0'
								src={fighter.image}
								style={{
									width: fighter.width,
									height: fighter.height,
									transform: flipped
										? 'scaleX(-1)'
										: undefined,
									borderColor: fighter.color.hex(),
								}}
							/>
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
