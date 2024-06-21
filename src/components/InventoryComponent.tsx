import type { ComponentSystem } from '@/types/Component';
import type { Slot } from '@/types/Slot';
import SlotComponent from './SlotComponent';
import InventoryContext from './InventoryContext';
import { AnimatePresence, motion } from 'framer-motion';

function InventoryComponent({
	inventory,
}: {
	inventory: ComponentSystem<Slot>;
}) {
	const [open] = InventoryContext.use();

	return (
		<AnimatePresence>
			{open && (
				<motion.div
					className='flex flex-wrap'
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
				>
					{inventory.values().map((slot) => (
						<SlotComponent slot={slot} key={slot.id} />
					))}
				</motion.div>
			)}
		</AnimatePresence>
	);
}

export default InventoryComponent;
