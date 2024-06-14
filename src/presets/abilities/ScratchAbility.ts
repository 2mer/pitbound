import { serializable } from "@/system/Serialization";
import { INestFighter } from "@/types/INest";
import { Tuple } from "@/types/Tuple";
import Icon from '@/assets/icons/ability/scratch.png';
import { HitAbility } from "./HitAbility";
import { ClawBrick } from "../bricks/ClawBrick";


export @serializable('ability.scratch') class ScratchAbility<T extends INestFighter> extends HitAbility<T> {
	image = Icon;
	name = 'Scratch';

	cost = Tuple(ClawBrick);
}