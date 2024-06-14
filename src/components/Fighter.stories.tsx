import type { Meta, StoryObj } from '@storybook/react';
import { Fighter } from '../types/Fighter';
import FighterComponent from './FighterComponent';
import useConst from '../hooks/useConst';
import Vertical from './Vertical';
import Horizontal from './Horizontal';
import { getRandomBrick } from './storyUtils';

const meta: Meta<typeof FighterComponent> = {
	component: FighterComponent,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	args: {
		fighter: new Fighter(),
	},
};

export const WithBricks: Story = {
	render() {
		const fighter = useConst(() => new Fighter());

		return (
			<Vertical style={{ gap: '16px' }}>
				<FighterComponent fighter={fighter} />
				<Horizontal>
					<button
						onClick={() => {
							fighter.bricks.removeChild(
								fighter.bricks.values()?.[0]
							);
							fighter.update();
						}}
					>
						-brick
					</button>
					<button
						onClick={() => {
							fighter.bricks.addChild(getRandomBrick());
							fighter.update();
						}}
					>
						+brick
					</button>
				</Horizontal>
			</Vertical>
		);
	},
};
