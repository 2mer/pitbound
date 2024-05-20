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
import { HandBrick } from '@/presets/bricks/HandBrick';
import { Ability } from '@/types/Ability';
import { Brick } from '@/types/Brick';

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

			s.friendly.addAll(
				new Dev().transform((dev) => {
					class TargetBelow5 extends Ability<Brick> {
						name = 'B5';
						description = 'Taarget brick with less than 5 hp';

						canClick() {
							return true;
						}

						onClick(): void {
							const stage = this.closest(Stage)!;

							stage.startTargeting<any>({
								ability: this,

								canTarget(target) {
									// return true;
									return (
										target instanceof Brick &&
										target.hasHealth() &&
										target.health < 5
									);
								},

								onTarget(target) {
									console.log({ target });

									stage.stopTargeting();
								},
							});
						}
					}

					dev.bricks
						.getT(HandBrick)!
						.abilities.addChild(new TargetBelow5());
				}),
				new Collector()
			);

			s.hostile.addAll(new Pitling(), new Pitling());

			s.background = `linear-gradient(to bottom, ${getRandomColor().hex()}, ${getRandomColor().hex()})`;

			return s;
		});

		return <StageComponent stage={stage} />;
	},
};
