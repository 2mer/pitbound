import { db } from "@/db";
import { useLiveQuery } from "dexie-react-hooks";
import { useParams } from "wouter";

export default function useSaveSlot() {
	const { slot } = useParams();
	const saveSlot = useLiveQuery(() => db.saves.where('name').equals(slot!).first());

	return saveSlot;
}