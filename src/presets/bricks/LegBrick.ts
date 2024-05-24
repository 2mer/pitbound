import { Brick } from "@/types/Brick";
import Icon from '@/assets/icons/brick/run.png';
import { serializable } from "@/system/Serialization";

export @serializable('brick.leg') class LegBrick extends Brick {
	name = 'Leg';
	image = Icon;
}