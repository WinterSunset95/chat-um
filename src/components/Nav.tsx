'use client'
import { connectAuthEmulator, getAuth, onAuthStateChanged } from "firebase/auth"
import { Button } from "./ui/button"
import { app } from "@/lib/firebase"
import Link from "next/link";
import { getFirestore } from "firebase/firestore";
import { useEffect } from "react";
import { checkFirestore, checkIfUserExistsOnDatabase } from "@/lib/setup";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function Nav({ chatId }: { chatId?: string }) {

	const auth = getAuth(app);
	const db = getFirestore(app);

	const theme = useTheme();

	useEffect(() => {
		checkFirestore(auth, db);
		onAuthStateChanged(auth, (user) => {
			checkIfUserExistsOnDatabase(auth, db);
		})
	}, [])

	return (
		<nav className="p-2 flex flex-row justify-between gap-2">
			<h1 className="text-2xl grow">{chatId ? chatId : "Chat@UnifiedMentor" }</h1>

			<Button onClick={() => {
				theme.setTheme(theme.theme === "dark" ? "light" : "dark");
			}}>
				<Sun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
				<Moon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
			</Button>

			{auth && auth.currentUser ?
			<Button asChild>
				<Link href="/profile">
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
