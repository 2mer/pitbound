import Icon from '@/assets/icons/brick/claw.png';
import { HandBrick } from "./HandBrick";
import { serializable } from '@/system/Serialization';

export @serializable('brick.claw') class ClawBrick extends HandBrick {
	name = 'Claw';
	image = Icon;
}