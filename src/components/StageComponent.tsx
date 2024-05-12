import styled from 'styled-components';
import { Stage } from '../types/Stage';
import FighterComponent from './FighterComponent';
import { createContext } from '@sgty/kontext-react';
import useConst from '@/hooks/useConst';
import { Button } from './ui/button';
import { playSound } from '@/utils/SoundPlayer';
import { useEffect } from 'react';

const Scroller = styled.div`
	display: flex;
	justify-content: stretch;
	width: 100%;
	height: 100%;
	align-items: stretch;
`;

export const StageContext = createContext(({ stage }: { stage: Stage }) => {
	return useConst(() => stage);
});

function StageComponent({ stage }: { stage: Stage }) {
	useEffect(() => {
		function handleSpace(e: KeyboardEvent) {
			if (e.key === ' ') {
				stage.endTurn();
			}
		}
		document.addEventListener('keypress', handleSpace);

		return () => {
			document.removeEventListener('keypress', handleSpace);
		};
	}, []);

	return (
		<StageContext.Provider stage={stage}>
			<Scroller>
				<div
					style={{ background: stage.background }}
					className='grid grid-cols-[1fr_auto_1fr] justify-center gap-[calc(theme(size.unit)*4)] p-[calc(theme(size.unit)*4)] flex-1 w-full items-center relative'
				>
					<div className='flex flex-col gap-[calc(theme(size.unit)*4)] items-end'>
						{stage.friendly.values().map((f) => (
							<FighterComponent key={f.id} fighter={f} />
						))}
					</div>

					<div className='flex self-stretch border-l-unit border-black border-opacity-20' />

					<div className='flex flex-col gap-[calc(theme(size.unit)*4)] items-start'>
						{stage.hostile.values().map((f) => (
							<FighterComponent key={f.id} fighter={f} flipped />
						))}
					</div>

					{/* actions */}
					<div
						className='fixed right-0 bottom-0 flex p-unit-4'
						onClick={() => {
							stage.endTurn();
							playSound('click');
						}}
					>
						<Button>End Turn</Button>
					</div>
				</div>
			</Scroller>
		</StageContext.Provider>
	);
}

export default StageComponent;
