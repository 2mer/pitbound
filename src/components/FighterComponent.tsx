import { Fighter } from '../types/Fighter';
import Horizontal from './Horizontal';
import BrickComponent from './BrickComponent';
import { useForceUpdate } from '../hooks/useForceUpdate';
import useEventListener from '../hooks/useEventListener';
import { AnimatePresence, motion } from 'framer-motion';
import { useTargeting } from './TargetingContext';
import { cn } from '@/lib/utils';
import { FighterContext } from './FighterContext';
import { StagePixiOverlay } from './StagePixiOverlay';
import { FillGradient, Graphics } from 'pixi.js';

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

	const { controller } = fighter;
	const { intent } = controller;

	StagePixiOverlay.useResizeEffect(
		({ app }) => {
			const g = new Graphics();

			intent.intents.forEach((i) => {
				const { origin, target, type } = i;

				const oBounds = document
					.getElementById(origin.id)!
					.getBoundingClientRect();
				const tBounds = document
					.getElementById(target.id)!
					.getBoundingClientRect();
				const aBounds = app.canvas.getBoundingClientRect();

				const color = type === 'harmful' ? 0xff0000 : 0x00ff00;
				const width = 4;

				const gradient = new FillGradient(
					oBounds.x - aBounds.x + oBounds.width / 2,
					oBounds.y - aBounds.y + oBounds.height / 2,
					tBounds.x - aBounds.x + tBounds.width / 2,
					tBounds.y - aBounds.y + tBounds.height / 2
				);

				gradient.addColorStop(0, 0x000000);
				gradient.addColorStop(1, color);

				g.setStrokeStyle({ width, fill: gradient });

				// g.rect(
				// 	oBounds.x - aBounds.x - width / 2,
				// 	oBounds.y - aBounds.y - width / 2,
				// 	oBounds.width + width,
				// 	oBounds.height + width
				// );
				g.rect(
					tBounds.x - aBounds.x - width / 2,
					tBounds.y - aBounds.y - width / 2,
					tBounds.width + width,
					tBounds.height + width
				);
				g.moveTo(
					oBounds.x - aBounds.x + oBounds.width / 2,
					oBounds.y - aBounds.y + oBounds.height / 2
				);
				g.lineTo(
					tBounds.x - aBounds.x + tBounds.width / 2,
					tBounds.y - aBounds.y + tBounds.height / 2
				);

				g.stroke();
			});

			app.stage.addChild(g);

			return () => {
				if (app.stage) {
					app.stage.removeChild(g);
				}
				g.destroy();
			};
		},
		[intent]
	);

	return (
		<FighterContext.Provider fighter={fighter}>
			<AnimatePresence>
				{fighter.isAlive() && (
					<motion.div
						id={fighter.id}
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

							isTargeting &&
								isCaster &&
								(flipped
									? `ml-[calc(theme('size.unit')*8)]`
									: `mr-[calc(theme('size.unit')*8)]`)
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
								className='bg-black border-unit border-solid border-r-0 box-content relative p-unit'
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
