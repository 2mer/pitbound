import { serializable } from "@/system/Serialization";
import { Slot } from "@/types/Slot";
import type { Brick } from "@/types/Brick";


export @serializable('slot.brick') class BrickSlot extends Slot<Brick> {
}
