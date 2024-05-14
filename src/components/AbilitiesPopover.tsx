import { PropsWithChildren, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { BrickContext } from './BrickComponent';
import AbilityComponent from './AbilityComponent';

function AbilitiesPopover({ children }: PropsWithChildren<{}>) {
	const brick = BrickContext.use();
	const [open, setOpen] = useState(false);

	const noAbilities = brick.abilities.isEmpty();

	return (
		<Popover
			open={open}
			onOpenChange={(v) => {
				if (noAbilities) return;
				setOpen(v);
			}}
		>
			<PopoverTrigger asChild>{children}</PopoverTrigger>

			<PopoverContent
				className='border-unit border-slate-800 bg-black rounded-none text-white w-auto p-unit'
				side='bottom'
			>
				<div className='flex gap-unit'>
					{brick.abilities.values().map((ability, index) => {
						return (
							<AbilityComponent
								ability={ability}
								key={index + '_' + ability.name}
								onClick={() => setOpen(false)}
							/>
						);
					})}
				</div>
			</PopoverContent>
		</Popover>
	);
}

export default AbilitiesPopover;
