import { Brick } from "@/types/Brick";
import Color from "color";
import Icon from '@/assets/icons/brick/bone.png';


export class BoneBrick extends Brick {
	name = 'Bone';
	color = new Color(0xFFFFFF);
	image = Icon;
}