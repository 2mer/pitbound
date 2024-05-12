import type { Meta, StoryObj } from '@storybook/react';
import BrickComponent from './BrickComponent';
import { Brick } from '../types/Brick';
import Color from 'color';

const meta: Meta<typeof BrickComponent> = {
	component: BrickComponent,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	args: {
		brick: new Brick().set({
			health: 25,
			maxHealth: 50,
			color: new Color(0xff0000),
			shields: 5,
		}),
	},
};
