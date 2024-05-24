import { Brick } from "@/types/Brick";
import Color from "color";
import Icon from '@/assets/icons/brick/bone.png';
import { serializable } from "@/system/Serialization";


export @serializable('brick.bone') class BoneBrick extends Brick {
	name = 'Bone';
	color = new Color(0xFFFFFF);
	image = Icon;
}