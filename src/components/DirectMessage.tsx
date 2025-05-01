'use client'
import { app } from "@/lib/firebase";
import { getAuth } from "firebase/auth";
import { addDoc, collection, doc, getDoc, getDocs, getFirestore, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react"
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { generateCombinedUid } from "@/lib/helpers";
import DmNav from "./DmNav";

export default function DirectMessage({
	userId,
}: {
	userId: string,
}) {

	const auth = getAuth(app);
	const db = getFirestore(app);
	const router = useRouter();

	const [myUser, setMyUser] = useState<User | null>(null);
	const [user, setUser] = useState<User | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const [text, setText] = useState<string>("");

	useEffect(() => {
		const tenantId = auth.tenantId;
		if (!auth.currentUser && !tenantId) {
			router.replace("/login");
			return;
		}

		console.log(tenantId, auth.currentUser.displayName);
		const usersCollection = collection(db, "tenants", auth.tenantId as string, "users");
		const myUserRef = doc(usersCollection, auth.currentUser.uid as string);
		const userRef = doc(usersCollection, userId);

		getDoc(myUserRef)
		.then((docSnap) => {
			if (docSnap.exists()) {
				setMyUser(docSnap.data() as User);
			} else {
				throw new Error("User not found");
			}
		})
		.catch((error) => {
			alert(error.message);
		})

		getDoc(userRef)
		.then((docSnap) => {
			if (docSnap.exists()) {
				setUser(docSnap.data() as User);
			} else {
				throw new Error("User not found");
			}
		})
		.catch((error) => {
			alert(error.message);
		})
	}, [])

	useEffect(() => {
		if (!myUser || !user) {
			return;
		}

		const convoId = generateCombinedUid(myUser?.uid as string, user?.uid as string);

		const messagesDocRef = doc(db, "tenants", auth.tenantId as string, "messages", convoId);
		const messagesCollection = collection(db, "tenants", auth.tenantId as string, "messages", convoId, "conversation");

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

	}, [myUser, user])

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const convoId = generateCombinedUid(myUser?.uid as string, user?.uid as string);

		const messagesCollection = collection(db, "tenants", auth.tenantId as string, "messages", convoId, "conversation");

		addDoc(messagesCollection, {
			senderId: myUser?.uid as string,
			senderName: myUser?.displayName as string,
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

	if (!myUser || !user) {
		return <div>Loading...</div>
	}

	return (
		<div className="h-full max-h-dvh w-full flex flex-col p-2">
			<DmNav me={myUser} them={user} />
			<div className="w-full flex-1 overflow-auto grid grid-cols-1 grid-rows-12 gap-2">
				<ul className="col-span-1 row-span-11 flex flex-col-reverse overflow-y-scroll gap-4">
					{messages.map((message) => (
						<li key={message.timestamp}
							className={`p-2
								rounded-sm
								max-w-[80%]
								${message.senderId === myUser.uid ? "self-end" : "self-start"}
								${message.senderId === myUser.uid ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}
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
