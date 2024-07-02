import { Button, buttonVariants } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, useLocation } from 'wouter';
import { SubmitHandler, useForm } from 'react-hook-form';
import { db } from '@/db';
import { Stage } from '@/types/Stage';
import { PartyEvent } from '@/presets/worldevents/PartyEvent';
import { Collector } from '@/presets/fighters/Collector';
import { Pitling } from '@/presets/fighters/Pitling';
import Serialization from '@/system/Serialization';
import meta from '@/meta';

type NewGameFormValues = {
	slotName: string;
};

export function createStarterStage() {
	const stage = new Stage();

	stage.world.leftEvent = new PartyEvent().addFighters(
		new Collector(),
		new Pitling()
	);

	return stage;
}

function NewGameView() {
	const [, setLocation] = useLocation();
	const { register, handleSubmit } = useForm<NewGameFormValues>();

	const onSubmit: SubmitHandler<NewGameFormValues> = async ({ slotName }) => {
		const stage = createStarterStage();
		stage.saveId = slotName;

		await db.saves.add({
			data: JSON.stringify(Serialization.serialize(stage)),
			name: slotName,
			created_at: new Date(),
			updated_at: new Date(),
			metadata: {},
			version: meta.version,
		});

		setLocation(`/saves/${slotName}`);
	};

	return (
		<div>
			<Card>
				<form onSubmit={handleSubmit(onSubmit)}>
					<CardHeader>New Game</CardHeader>
					<CardContent>
						<Label>Save Slot Name</Label>
						<Input {...register('slotName', { required: true })} />
					</CardContent>
					<CardFooter className='flex justify-between'>
						<Link
							to='/saves'
							className={buttonVariants({ variant: 'outline' })}
						>
							Cancel
						</Link>
						<Button>Begin New Game</Button>
					</CardFooter>
				</form>
			</Card>
			<div className='flex flex-col gap-unit-4 p-unit-4'></div>
		</div>
	);
}

export default NewGameView;
