import type { Meta, StoryObj } from '@storybook/react';
import NodeMapComponent from './NodeMapComponent';

const meta: Meta<typeof NodeMapComponent> = {
	component: NodeMapComponent,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	args: {
		// PixiProps: { style: { width: '200px', height: '200px' } },
	},
};
