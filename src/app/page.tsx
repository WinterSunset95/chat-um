'use client'
import Image from "next/image";
import Nav from "@/components/Nav";
import { mockUsersList } from "@/lib/mock";
import UserList from "@/components/UserList";
import { getAuth } from "firebase/auth";
import { collection, getDoc, getDocs, getFirestore, onSnapshot, query } from "firebase/firestore";
import { app } from "@/lib/firebase";
import { useEffect, useState } from "react";

export default function Home() {

	const users = mockUsersList();

	const auth = getAuth(app);
	const db = getFirestore(app);

	const [usersList, setUsersList] = useState<User[]>([]);

	useEffect(() => {
		const usersCollection = collection(db, "tenants", "chat-um-bhulo", "users");
		getDocs(usersCollection)
		.then((snapshot) => {
			setUsersList([]);
			snapshot.forEach((doc) => {
				setUsersList((prev) => [...prev, doc.data() as User]);
			})
		})

		const q = query(usersCollection);

		const unsub = onSnapshot(q, (snapshot) => {
			setUsersList([]);
			snapshot.forEach((doc) => {
				setUsersList((prev) => [...prev, doc.data() as User]);
			})
		});

		return () => {
			unsub();
		}
	}, [])

	return (
		<div className="h-full w-full flex flex-col gap-2 p-4">
			<Nav />
			<UserList users={usersList} />
		</div>
	);
}
