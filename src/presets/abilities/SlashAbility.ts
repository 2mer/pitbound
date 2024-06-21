import Icon from '@/assets/icons/ability/slash.png';
import { serializable } from "@/system/Serialization";
import type { INestFighter } from "@/types/INest";
import { HitAbility } from "./HitAbility";

export @serializable('ability.slash') class SlashAbility<T extends INestFighter> extends HitAbility<T> {
	image = Icon;
	name = 'Slash';
}