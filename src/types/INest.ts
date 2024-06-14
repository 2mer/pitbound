import type { Fighter } from "./Fighter";
import type { Stage } from "./Stage";
import type { WorldEvent } from "./WorldEvent";

export type INest<TKey extends string, T> = { readonly [key in TKey]: T };

export type INestStage = INest<'stage', Stage>
export type INestEvent<T extends WorldEvent<any>> = INest<'event', T>
export type INestFighter = INest<'fighter', Fighter> & INestStage;