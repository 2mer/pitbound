import { cn } from '@/lib/utils';
import { ComponentProps, ReactNode } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

function IconButton({
	icon,
	tooltip,
	className,
	...rest
}: { icon: string; tooltip?: ReactNode } & ComponentProps<'div'>) {
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<div
					className={cn('cursor-pointer hover:opacity-55', className)}
					{...rest}
				>
					<img src={icon} className='h-[32px] rendering-pixelated' />
				</div>
			</TooltipTrigger>
			<TooltipContent>{tooltip}</TooltipContent>
		</Tooltip>
	);
}

export default IconButton;
