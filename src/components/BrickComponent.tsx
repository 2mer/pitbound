import { Brick } from '../types/Brick';
import { FighterContext } from './FighterContext';
import { AnimatePresence, motion } from 'framer-motion';

import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import AbilitiesPopover from './AbilitiesPopover';
import { useTargeting } from './TargetingContext';
import UsedIcon from '@/assets/icons/ability/used.png';
import { BrickContext } from './BrickContext';
import InventoryComponent from './InventoryComponent';

function BrickComponent({ brick }: { brick: Brick }) {
	const fighter = FighterContext.use();

	const description = brick.getDescription();
	const isFriendly = fighter.isFriendly;
	const canClick = brick.canClick();

	const [ref, { isTargetable, isTargeting }] = useTargeting(brick);

	return (
		<BrickContext.Provider brick={brick}>
			<AnimatePresence>
				{brick.isAlive() && (
					<motion.div
						id={brick.id}
						className={cn(
							'flex flex-col relative group/brick',
							isTargeting &&
								isTargetable &&
								'cursor-pointer targetable-brick'
						)}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						ref={ref as any}
					>
						<div
							className={cn(
								'flex flex-col items-center gap-unit transition-all duration-200',
								isTargeting &&
									!isTargetable &&
									'opacity-25 pointer-events-none'
							)}
							style={{
								width: brick.width,
								height: brick.height,
							}}
						>
							{/* brick icon */}
							<Tooltip disableHoverableContent>
								<TooltipTrigger asChild>
									<div>
										<AbilitiesPopover>
											<img
												src={brick.image}
												className={cn(
													'w-full h-[32px] rendering-pixelated object-contain transition-all duration-200',

													canClick
														? 'cursor-pointer'
														: isFriendly
															? 'opacity-25'
															: ''
												)}
											/>
										</AbilitiesPopover>
										{!Brick.canUseBrick(brick) && (
											<img
												src={UsedIcon}
												className='absolute top-0 right-0 w-[32px] h-[32px] rendering-pixelated pointer-events-none'
											/>
										)}
									</div>
								</TooltipTrigger>

								<TooltipContent>
									<div className='divide-y-unit'>
										<div className='flex flex-col'>
											<div className='font-barlow font-bold'>
												{brick.name}
											</div>

											{Boolean(description) && (
												<div className='font-barlow '>
													{description}
												</div>
											)}
										</div>

										{brick.keywords
											.values()
											.map((keyword) => {
												return (
													<div key={keyword.name}>
														<span
															className='font-barlow font-bold'
															style={{
																color: keyword.color.hex(),
															}}
														>
															{keyword.name}
														</span>
														:{' '}
														{keyword.getDescription()}
													</div>
												);
											})}
									</div>
								</TooltipContent>
							</Tooltip>

							<div className='flex-1 relative w-full'>
								{/* brick health bar */}
								{brick.hasHealth() && (
									<Tooltip disableHoverableContent>
										<TooltipTrigger asChild>
											<div className='bg-black w-full h-full relative shadow-slate-900 inset-box-shadow-border-unit [box-shadow:inset_0_0_0_4px_var(--tw-shadow-color)]'>
												<div
													className='flex absolute top-0 left-0 right-0 border-unit border-solid transition-all duration-200'
													style={{
														height: `${(brick.health / brick.maxHealth) * 100}%`,
														borderColor:
															brick.color.hex(),
														background: brick.color
															.darken(0.3)
															.hex(),
													}}
												/>
												<div className='absolute flex flex-col inset-0 justify-between'>
													<div className='h-[32px] text-white font-teachers w-full flex items-center justify-center'>
														{brick.health}
													</div>

													{Boolean(brick.shields) && (
														<div className='m-unit'>
															<div className='border-unit border-solid border-slate-700 bg-slate-900 h-[calc(32px-theme(size.unit))] text-white font-teachers w-full flex items-center justify-center rounded-b-[50%]'>
																{brick.shields}
															</div>
														</div>
													)}
												</div>
											</div>
										</TooltipTrigger>
										<TooltipContent>
											<div className='h-[32px] font-teachers w-full flex items-center justify-center'>
												{brick.health}/{brick.maxHealth}{' '}
												(+
												{brick.shields})
											</div>
										</TooltipContent>
									</Tooltip>
								)}

								<div className='absolute inset-0'>
									<InventoryComponent
										inventory={brick.inventory}
									/>
								</div>
							</div>
						</div>

						{/* brick targeting indication */}
						<AnimatePresence>
							{isTargeting && isTargetable && (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									className='absolute target-brick-indication [--targeting-padding:calc(theme(size.unit)*-2)]'
								/>
							)}
						</AnimatePresence>
					</motion.div>
				)}
			</AnimatePresence>
		</BrickContext.Provider>
	);
}

export default BrickComponent;
