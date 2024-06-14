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
import { Skull } from '@/presets/fighters/Skull';
import { PartyEvent } from '@/presets/worldevents/PartyEvent';
import { BattleEvent } from '@/presets/worldevents/BattleEvent';

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

			const friendly = new PartyEvent();
			const hostile = new BattleEvent();

			Array.from({ length: getRandomInt(2, 5) }).forEach(() => {
				friendly.fighters.addChild(getRandomFighter());
			});

			Array.from({ length: getRandomInt(2, 5) }).forEach(() => {
				hostile.fighters.addChild(getRandomEnemy());
			});

			s.background = `linear-gradient(to bottom, ${getRandomColor().hex()}, ${getRandomColor().hex()})`;

			s.world.leftEvent = friendly;
			s.world.rightEvent = hostile;

			s.init();

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

			s.world.leftEvent = new PartyEvent().addFighters(
				new Pitling().set({ color: new Color(0x00ff00) })
			);

			s.world.rightEvent = new BattleEvent().addFighters(
				new Pitling().set({ color: new Color(0xff0000) }).hostile(),
				new Pitling().set({ color: new Color(0xff0000) }).hostile()
			);

			s.background = `linear-gradient(to bottom, ${getRandomColor().hex()}, ${getRandomColor().hex()})`;

			s.init();

			return s;
		});

		return <StageComponent stage={stage} />;
	},
};

export const Targeting: Story = {
	render() {
		const stage = useConst(() => {
			const s = new Stage();

			s.world.leftEvent = new PartyEvent().addFighters(
				new Dev().transform((dev) => {
					class TargetBelow5 extends Ability<Brick> {
						name = 'B5';
						description = 'Taarget brick with less than 5 hp';

						canUse() {
							return true;
						}

						onUse(): void {
							const stage = this.parent!.stage;

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
				new Collector(),
				new Pitling(),
				new Skull()
			);

			s.world.rightEvent = new BattleEvent().addFighters(
				new Pitling().hostile(),
				new Pitling().hostile()
			);

			s.background = `linear-gradient(to bottom, ${getRandomColor().hex()}, ${getRandomColor().hex()})`;

			s.init();

			return s;
		});

		return <StageComponent stage={stage} />;
	},
};

export const Flipped: Story = {
	render() {
		const stage = useConst(() => {
			const s = new Stage();

			s.world.rightEvent = new PartyEvent().addFighters(
				new Dev(),
				new Collector(),
				new Pitling(),
				new Skull()
			);

			s.world.leftEvent = new BattleEvent().addFighters(
				new Pitling().hostile(),
				new Pitling().hostile()
			);

			s.background = `linear-gradient(to bottom, ${getRandomColor().hex()}, ${getRandomColor().hex()})`;

			s.init();

			return s;
		});

		return <StageComponent stage={stage} />;
	},
};

export const Map: Story = {
	render() {
		const stage = useConst(() => {
			const s = new Stage();

			s.world.leftEvent = new PartyEvent().addFighters(
				new Dev(),
				new Collector(),
				new Pitling(),
				new Skull()
			);

			// s.world.rightEvent = new BattleEvent().addFighters(
			// 	new Pitling().hostile(),
			// 	new Pitling().hostile()
			// );

			s.background = `linear-gradient(to bottom, ${getRandomColor().hex()}, ${getRandomColor().hex()})`;

			s.init();

			return s;
		});

		return <StageComponent stage={stage} />;
	},
};
