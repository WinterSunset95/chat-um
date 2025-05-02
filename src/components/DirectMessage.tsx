'use client'
import { app } from "@/lib/firebase";
import { getAuth, User } from "firebase/auth";
import { addDoc, collection, doc, getDoc, getDocs, getFirestore, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react"
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { generateCombinedUid } from "@/lib/helpers";
import DmNav from "./DmNav";
import { useAuth } from "./AuthProvider";
import { Message, Room } from "@/lib/types";

// userId here is either the usersId or the roomId
// If "room" exists, this component is being called from the rooms page
export default function DirectMessage({
	me,
	them,
	room
}: {
	me: User,
	them?: User,
	room?: Room
}) {
	const db = getFirestore(app);
	let convoId = room ? room.id : generateCombinedUid(me.uid as string, them.uid as string);

	const [messages, setMessages] = useState<Message[]>([]);
	const [text, setText] = useState<string>("");

	useEffect(() => {
		const messagesCollection = collection(db, "tenants", me.tenantId as string, "messages", convoId, "conversation");
		getDocs(messagesCollection)
		.then((snapshot) => {
			setMessages([]);
			snapshot.forEach((message) => {
				const data = message.data();
				const toPush: Message = {
					id: message.id,
					senderId: data.senderId,
					senderName: data.senderName,
					content: data.content,
					timestamp: data.timestamp,
					type: data.type
				}
				setMessages((prev) => [...prev, toPush]);
			})
		})
		.catch((error) => {
			console.log(error);
		})

		const q = query(messagesCollection, orderBy("timestamp", "desc"));
		const unsub = onSnapshot(q, (snapshot) => {
			setMessages([]);
			snapshot.forEach((message) => {
				const data = message.data();
				const toPush: Message = {
					id: message.id,
					senderId: data.senderId,
					senderName: data.senderName,
					content: data.content,
					timestamp: data.timestamp,
					type: data.type
				}
				setMessages((prev) => [...prev, toPush]);
			})
		});

		return () => {
			unsub();
		}
	}, [])

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const messagesCollection = collection(db, "tenants", me.tenantId as string, "messages", convoId, "conversation");

		addDoc(messagesCollection, {
			senderId: me.uid as string,
			senderName: me.displayName as string,
			content: text,
			timestamp: Date.now(),
			type: "text",
		})
		.then(() => {
			setText("");
		})
		.catch((error) => {
			console.log(error);
		})
	}

	return (
		<div className="h-full max-h-dvh w-full flex flex-col p-2">
			<DmNav them={them} room={room} />
			<div className="w-full flex-1 overflow-auto grid grid-cols-1 grid-rows-12 gap-2">
				<ul className="col-span-1 row-span-11 flex flex-col-reverse overflow-y-scroll gap-4">
					{messages.map((message) => (
						<li key={message.timestamp}
							className={`p-2
								rounded-sm
								max-w-[80%]
								${message.senderId === me.uid ? "self-end" : "self-start"}
								${message.senderId === me.uid ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}
							`}
						>
							<p className="font-bold text-xl">{message.senderName}</p>
							<p>{message.content}</p>
						</li>
					))}
				</ul>
				<form className="col-span-1 row-span-1 flex flex-row gap-2 mb-5" onSubmit={handleSubmit}>
					<Input type="text" placeholder="Send message" className="w-full" value={text} onChange={(e) => setText(e.target.value)} />
					<Button type="submit">Send</Button>
				</form>
			</div>
		</div>
	)
}
