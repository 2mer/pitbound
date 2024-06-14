import { Ability } from '@/types/Ability';
import { Tooltip, TooltipContent } from './ui/tooltip';
import { TooltipTrigger } from '@radix-ui/react-tooltip';
import { cn } from '@/lib/utils';

function AbilityComponent({
	ability,
	onClick,
}: {
	ability: Ability<any>;
	onClick?: () => void;
}) {
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<img
					src={ability.getImage()}
					className={cn(
						'h-[32px] w-[32px] rendering-pixelated transition-all duration-200',
						ability.canUse() ? 'cursor-pointer' : 'opacity-25'
					)}
					onClick={() => {
						if (ability.canUse()) {
							ability.onUse();
							onClick?.();
						}
					}}
				/>
			</TooltipTrigger>

			<TooltipContent
				className='border-unit border-slate-800 bg-black rounded-none text-white'
				side='bottom'
			>
				<div>{ability.name}</div>
				<div>{ability.getDescription()}</div>

				{Boolean(ability.cost?.length) && (
					<div className='mt-unit-4 flex flex-col gap-unit'>
						<div>uses:</div>
						<div className='flex gap-unit'>
							{ability.cost?.map((clzz) => {
								const brick = new clzz();

								return (
									<img
										key={brick.id}
										src={brick.image}
										className='h-[32px] rendering-pixelated'
										role='button'
										style={{ width: brick.width }}
									/>
								);
							})}
						</div>
					</div>
				)}
			</TooltipContent>
		</Tooltip>
	);
}

export default AbilityComponent;
