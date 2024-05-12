import Color from 'color';
import Vertical from './Vertical';
import styled, { CSSProperties } from 'styled-components';
import { ComponentProps } from 'react';

const Root = styled(Vertical)`
	gap: ${(p) => p.theme.unit};
`;

const PipsSM = styled.div<{ $color: string }>`
	display: flex;
	background: linear-gradient(
		to bottom,
		${(p) => p.$color} 50%,
		transparent 50%
	);
	background-size: 100% calc(${(p) => p.theme.unit} * 2);
	height: calc(var(--unit-height) * ${(p) => p.theme.unit});
`;

function Pips({
	values,
	...rest
}: { values: { amount: number; color: Color }[] } & ComponentProps<
	typeof Root
>) {
	return (
		<Root {...rest}>
			{values.map((v, index) => {
				if (!v.amount) return null;

				return (
					<PipsSM
						key={index}
						$color={v.color.hex()}
						style={
							{
								'--unit-height': v.amount * 2 - 1,
							} as CSSProperties
						}
					/>
				);
			})}
		</Root>
	);
}

export default Pips;
