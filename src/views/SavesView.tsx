import { Button, buttonVariants } from '@/components/ui/button';
import { Link } from 'wouter';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db';
import calc from '@/utils/calc';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

function SavesView() {
	const saves = useLiveQuery(() => db.saves.toArray());

	return (
		<div className='flex flex-col gap-unit-4 p-unit-4'>
			<div>Saves</div>
			{/* actions */}
			<div>
				<Link to='/new-game' className={buttonVariants()}>
					New Game
				</Link>
			</div>

			{/* current saves */}
			<div className='flex gap-unit-4'>
				{calc(() => {
					if (!saves?.length) return <div>No saves</div>;

					return saves.map((save) => (
						<Card
							key={save.id}
							className='className="bg-white shadow-md rounded-lg overflow-hidden transition-all ease-in-out duration-300 hover:shadow-xl'
						>
							<Link to={`/saves/${save.name}`}>
								<CardHeader>
									<CardTitle>{save.name}</CardTitle>
								</CardHeader>
								<CardContent>
									<div>image</div>
									<div>
										Last save:{' '}
										{save.updated_at.toLocaleString()}
									</div>
								</CardContent>
								<CardFooter className='flex flex-row-reverse'>
									<Button
										variant='destructive'
										onClick={(e) => {
											e.stopPropagation();
											e.preventDefault();

											db.saves
												.where('id')
												.equals(save.id)
												.delete();
										}}
									>
										delete
									</Button>
								</CardFooter>
							</Link>
						</Card>
					));
				})}
			</div>
		</div>
	);
}

export default SavesView;
