import Color from "color";

export type Rarity = { name: string, color: Color }

export const Rarity = {

	BASIC: { name: 'Basic', color: new Color(0x4a5462) },
	COMMON: { name: 'Common', color: new Color(0x59c135) },
	UNCOMMON: { name: 'Uncommon', color: new Color(0x285cc4) },
	RARE: { name: 'Rare', color: new Color(0xbc4a9b) },
	MYTHICAL: { name: 'Mythical', color: new Color(0x20d6c7) },
	LEGENDARY: { name: 'Legendary', color: new Color(0xf9a31b) },

} satisfies { [key: string]: Rarity }