import Dexie, { type EntityTable } from 'dexie';

export interface SaveEntry {
	id: number,
	name: string,
	data: string,
	created_at: Date,
	updated_at: Date,
	metadata: any,
	version: string,
}

export const db = new Dexie('GameDB') as Dexie & {
	saves: EntityTable<SaveEntry, 'id'>
};


db.version(1).stores({
	saves: '++id,name,data,created_at,updated_at,metadata,version'
})