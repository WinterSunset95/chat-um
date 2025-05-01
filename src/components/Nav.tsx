'use client'
import { connectAuthEmulator, getAuth, onAuthStateChanged } from "firebase/auth"
import { Button } from "./ui/button"
import { app } from "@/lib/firebase"
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import Link from "next/link";
import { getFirestore } from "firebase/firestore";
import { useEffect } from "react";
import { checkFirestore, checkIfUserExistsOnDatabase } from "@/lib/setup";

export default function Nav({ chatId }: { chatId?: string }) {

	const auth = getAuth(app);
	const db = getFirestore(app);

	useEffect(() => {
		checkFirestore(auth, db);
		onAuthStateChanged(auth, (user) => {
			checkIfUserExistsOnDatabase(auth, db);
		})
	}, [])

	return (
		<nav className="p-2 flex flex-row justify-between">
			<h1 className="text-2xl">{chatId ? chatId : "Chat@UnifiedMentor" }</h1>
			{auth && auth.currentUser ?
			<Button asChild>
				<Link href="/profile">
					<Avatar>
						<AvatarImage src={auth.currentUser.photoURL as string} />
					</Avatar>
					<h1>{auth.currentUser.displayName}</h1>
				</Link>
			</Button>
			:
			<Button asChild>
				<Link href="/login">Login</Link>
			</Button>
			}
		</nav>
	)
}
