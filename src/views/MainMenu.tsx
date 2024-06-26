import { buttonVariants } from '@/components/ui/button';
import { Link } from 'wouter';

function MainMenu() {
	return (
		<div className='flex flex-col gap-unit-4 p-unit-4'>
			<Link to='/saves' className={buttonVariants({})}>
				Play
			</Link>
			<Link to='/settings' className={buttonVariants({})}>
				Settings
			</Link>
		</div>
	);
}

export default MainMenu;
