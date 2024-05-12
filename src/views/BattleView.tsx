import styled from 'styled-components';
import BrickComponent from '../components/BrickComponent';
import { Brick } from '../types/Brick';
import Color from 'color';
import { Stage } from '../types/Stage';
import { Fighter } from '../types/Fighter';
import { HeartBrick } from '../presets/bricks/HeartBrick';
import StageComponent from '../components/StageComponent';

const Root = styled.div`
	width: 100%;
	height: 100%;
`;

const hero = new Fighter();
hero.bricks = [
	new HeartBrick().set({ health: 10, maxHealth: 10 }),
	new Brick().set({
		health: 10,
		maxHealth: 10,
		color: new Color(0xfafafa),
	}),
];

const skeleton = new Fighter();
skeleton.bricks = [
	new HeartBrick().set({
		health: 10,
		maxHealth: 10,
		color: new Color(0xacacac),
	}),
	new Brick().set({
		health: 10,
		maxHealth: 10,
		color: new Color(0xfafafa),
	}),
];

const stage = new Stage();
stage.friendly = [hero, hero, hero];
stage.hostile = [skeleton, skeleton];

function BattleView() {
	return (
		<Root>
			<StageComponent stage={stage} />
		</Root>
	);
}

export default BattleView;
