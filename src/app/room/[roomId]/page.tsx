'use client'
import { useAuth } from "@/components/AuthProvider";
import DirectMessage from "@/components/DirectMessage";
import { app } from "@/lib/firebase";
import { type Room } from "@/lib/types";
import { collection, doc, getDoc, getFirestore } from "firebase/firestore";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Room () {
	const me = useAuth();
	const { roomId } = useParams();
	const db = getFirestore(app);
	const [room, setRoom] = useState<Room | null>(null);

	useEffect(() => {
		if (!roomId) {
			return;
		}

		const roomsCollection = collection(db, "tenants", "chat-um-bhulo", "rooms");
		const docRef = doc(roomsCollection, roomId as string);
		getDoc(docRef)
		.then((docSnap) => {
			if (docSnap.exists()) {
				setRoom(docSnap.data() as Room);
			}
		})
		.catch((error) => {
			console.log("Error getting document:", error);
		})
	}, [roomId]);

	if (!room || !me) {
		return (
			<div>Loading</div>
		)
	}

	return (
		<DirectMessage me={me} room={room} />
	)
}

