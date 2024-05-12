import Color from "color";
import { Brick } from "../types/Brick";
import { Fighter } from "../types/Fighter";
import { Skull } from "@/presets/fighters/Skull";
import { Pitling } from "@/presets/fighters/Pitling";

export function getRandomInt(min: number, max: number) {
	return min + Math.floor(Math.random() * (max - min));
}

export function getRandomColor() {
	return new Color(0xffffff * Math.random());
}

export function getRandomBrick() {
	const maxHealth = Math.floor(Math.random() * 50);
	return new Brick().set({
		health: Math.floor(Math.random() * maxHealth),
		maxHealth,
		color: getRandomColor(),
		shields: Math.max(0, Math.floor(Math.random() * 10 - 5)),
	});
}

export function getRandomFighter() {
	const fighter = new Fighter();

	fighter.color = getRandomColor();

	fighter.bricks = Array.from({ length: getRandomInt(3, 6) }).fill(null).map(getRandomBrick);

	return fighter;
}

export function randomItem<T extends any[]>(items: T) {
	return items[Math.round(Math.random() * (items.length - 1))]
}

const enemies = [
	Pitling,
	Skull,
]

export function getRandomEnemy() {
	const fighter = new (randomItem(enemies))();

	return fighter;
}