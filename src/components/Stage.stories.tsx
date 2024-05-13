import type { Meta, StoryObj } from '@storybook/react';
import useConst from '../hooks/useConst';
import Vertical from './Vertical';
import Color from 'color';
import StageComponent from './StageComponent';
import { Stage } from '../types/Stage';
import {
	getRandomColor,
	getRandomEnemy,
	getRandomFighter,
	getRandomInt,
} from './storyUtils';
import { Pitling } from '@/presets/fighters/Pitling';
import { Collector } from '@/presets/fighters/Collector';
import { Dev } from '@/presets/fighters/Dev';

const meta: Meta<typeof StageComponent> = {
	component: StageComponent,
	parameters: {
		layout: 'fullscreen',
	},
};

export default meta;

type Story = StoryObj<typeof meta>;

// export const Playground: Story = {
// 	args: {
// 		stage: new Stage(),
// 	},
// };

export const Random: Story = {
	render() {
		const stage = useConst(() => {
			const s = new Stage();

			Array.from({ length: getRandomInt(2, 5) }).forEach(() => {
				s.friendly.addChild(getRandomFighter());
			});

			Array.from({ length: getRandomInt(2, 5) }).forEach(() => {
				s.hostile.addChild(getRandomEnemy());
			});

			s.background = `linear-gradient(to bottom, ${getRandomColor().hex()}, ${getRandomColor().hex()})`;

			return s;
		});

		return (
			<Vertical style={{ gap: '16px' }}>
				<StageComponent stage={stage} />
				{/* <Horizontal>
					<button
						onClick={() => {
							fighter.bricks.pop();
							fighter.update();
						}}
					>
						-brick
					</button>
					<button
						onClick={() => {
							fighter.bricks.push(getRandomBrick());
							fighter.update();
						}}
					>
						+brick
					</button>
				</Horizontal> */}
			</Vertical>
		);
	},
};

export const Attack: Story = {
	render() {
		const stage = useConst(() => {
			const s = new Stage();

			s.friendly.addAll(
				new Pitling().set({ color: new Color(0x00ff00) })
			);

			s.hostile.addAll(
				new Pitling().set({ color: new Color(0xff0000) }),
				new Pitling().set({ color: new Color(0xff0000) })
			);

			s.background = `linear-gradient(to bottom, ${getRandomColor().hex()}, ${getRandomColor().hex()})`;

			return s;
		});

		return <StageComponent stage={stage} />;
	},
};

export const Targeting: Story = {
	render() {
		const stage = useConst(() => {
			const s = new Stage();

			s.friendly.addAll(new Dev(), new Collector());

			s.hostile.addAll(
				new Pitling().set({ color: new Color(0xff0000) }),
				new Pitling().set({ color: new Color(0xff0000) })
			);

			s.background = `linear-gradient(to bottom, ${getRandomColor().hex()}, ${getRandomColor().hex()})`;

			return s;
		});

		return <StageComponent stage={stage} />;
	},
};
