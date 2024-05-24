import { getRandomColor } from '@/components/storyUtils';
import useConst from '@/hooks/useConst';
import { Collector } from '@/presets/fighters/Collector';
import { Dev } from '@/presets/fighters/Dev';
import { Pitling } from '@/presets/fighters/Pitling';
import { Stage } from '@/types/Stage';
import type { Meta, StoryObj } from '@storybook/react';
import Serialization from './Serialization';
import { useMemo, useState } from 'react';
import StageComponent from '@/components/StageComponent';
import { Button } from '@/components/ui/button';

const meta: Meta<any> = {
	component: () => <div />,
	parameters: {
		layout: 'fullscreen',
	},
};

export default meta;

type Story = StoryObj<typeof meta>;

const Example = () => {
	const stage = useConst(() => {
		const s = new Stage();

		s.friendly.addAll(new Dev(), new Collector());

		s.hostile.addAll(new Pitling(), new Pitling());

		s.background = `linear-gradient(to bottom, ${getRandomColor().hex()}, ${getRandomColor().hex()})`;

		return s;
	});

	const [serialized, setSerialized] = useState({ json: '' });

	function serialize() {
		setSerialized({
			json: JSON.stringify(Serialization.serialize(stage), null, 4),
		});
	}

	const deserialized = useMemo(
		() =>
			serialized.json &&
			Serialization.deserialize<Stage>(JSON.parse(serialized.json)),
		[serialized]
	);

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
			<div style={{ position: 'relative' }}>
				<div style={{ position: 'absolute', top: 0, left: 0 }}>
					source
				</div>
				<StageComponent stage={stage} />
			</div>

			<Button onClick={serialize}>Serialize</Button>

			{serialized.json && (
				<>
					<div style={{ position: 'relative' }}>
						<div style={{ position: 'absolute', top: 0, left: 0 }}>
							deserialize
						</div>
						<StageComponent
							stage={deserialized as Stage}
							key={Date.now()}
						/>
					</div>
					<div
						style={{
							whiteSpace: 'pre-wrap',
							padding: '10px',
							fontFamily: 'monospace',
						}}
					>
						{serialized.json}
					</div>
				</>
			)}
		</div>
	);
};

export const Playground: Story = {
	render() {
		return <Example />;
	},
};
