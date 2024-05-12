import { Fighter } from "./Fighter";
import { Item } from "./Item";

export class GameState {
	party: Fighter[] = [];
	inventory: Item<any>[] = []
}