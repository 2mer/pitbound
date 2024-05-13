import { Brick } from '../types/Brick';
import { FighterContext } from './FighterComponent';
import { StageContext } from './StageComponent';
import { AnimatePresence, motion } from 'framer-motion';

import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent } from './ui/popover';
import { PopoverTrigger } from '@radix-ui/react-popover';
import { createContext } from '@sgty/kontext-react';
import useConst from '@/hooks/useConst';
import AbilitiesPopover from './AbilitiesPopover';

export const BrickContext = createContext(({ brick }: { brick: Brick }) =>
	useConst(() => brick)
);

function BrickComponent({ brick }: { brick: Brick }) {
	const stage = StageContext.use();
	const fighter = FighterContext.use();

	const description = brick.getDescription();
	const isFriendly = stage.isFriendly(fighter);
	const canClick = brick.canClick();

	return (
		<BrickContext.Provider brick={brick}>
			<AnimatePresence>
				{brick.isAlive() && (
					<motion.div
						className='flex flex-col'
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						<div
							className='flex flex-col items-center gap-unit'
							style={{
								width: brick.width,
								height: brick.height,
							}}
						>
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
											{brick.health}/{brick.maxHealth} (+
											{brick.shields})
										</div>
									</TooltipContent>
								</Tooltip>
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</BrickContext.Provider>
	);
}

export default BrickComponent;
