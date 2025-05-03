'use client'
import { useAuth } from "@/components/AuthProvider";
import DirectMessage from "@/components/DirectMessage";
import { Button } from "@/components/ui/button";
import { app } from "@/lib/firebase";
import { type Room } from "@/lib/types";
import { getAuth } from "firebase/auth";
import { collection, doc, getDoc, getFirestore } from "firebase/firestore";
import { TurtleIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Room () {
	const me = useAuth();
	const { roomId } = useParams();
	const db = getFirestore(app);
	const [room, setRoom] = useState<Room | null>(null);
	const auth = getAuth();

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
			<div className="flex flex-col justify-center items-center gap-4">
				<TurtleIcon size={64} />
				<h1>You need to be logged in to access this page</h1>
				<Button>
					<Link href="/login">Click here to login</Link>
				</Button>
			</div>
		)
	}

	return (
		<DirectMessage me={me} room={room} />
	)
}

