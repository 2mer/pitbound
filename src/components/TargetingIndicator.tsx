import { motion } from 'framer-motion';
import { StageContext } from './StageComponent';
import AbilityComponent from './AbilityComponent';

function TargetingIndicator() {
	const stage = StageContext.use();
	const isTargeting = Boolean(stage.targeting);

	if (!isTargeting) return null;

	return (
		<motion.div
			className='sticky b-0 m-unit-4 bottom-unit-4 w-fit flex p-unit pr-unit-4 pointer-events-none bg-black border-solid border-unit border-slate-700 gap-unit-4 items-center text-white justify-self-center'
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
		>
			{stage?.targeting?.caster && (
				<img
					src={stage.targeting.caster.image}
					className='rendering-pixelated transition-all duration-200'
					style={{
						width: stage.targeting.caster.width,
						height: stage.targeting.caster.height,
					}}
				/>
			)}
			{stage?.targeting?.ability && (
				<AbilityComponent ability={stage?.targeting?.ability} />
			)}

			<div>Choose a target</div>
		</motion.div>
	);
}

export default TargetingIndicator;
