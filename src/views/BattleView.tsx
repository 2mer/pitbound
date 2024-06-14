import styled from 'styled-components';
import { Brick } from '../types/Brick';
import Color from 'color';
import { Stage } from '../types/Stage';
import { Fighter } from '../types/Fighter';
import { HeartBrick } from '../presets/bricks/HeartBrick';
import StageComponent from '../components/StageComponent';
import { PartyEvent } from '@/presets/worldevents/PartyEvent';
import { BattleEvent } from '@/presets/worldevents/BattleEvent';

const Root = styled.div`
	width: 100%;
	height: 100%;
`;

const hero = () => {
	const hero = new Fighter();
	hero.bricks.addAll(
		new Brick().set({
			health: 10,
			maxHealth: 10,
			color: new Color(0xfafafa),
		}),
		new HeartBrick().set({ health: 10, maxHealth: 10 })
	);
	return hero;
};

const stage = new Stage();
// stage.world.leftEvent = new PartyEvent().addFighters(hero(), hero(), hero());
stage.world.leftEvent = new PartyEvent().addFighters(hero());

stage.world.rightEvent = new BattleEvent()
	.addFighters
	// getRandomEnemy(),
	// getRandomEnemy(),
	// getRandomEnemy()
	();

stage.init();

function BattleView() {
	return (
		<Root>
			<StageComponent stage={stage} />
		</Root>
	);
}

export default BattleView;
