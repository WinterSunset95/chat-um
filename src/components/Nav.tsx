'use client'
import { getAuth } from "firebase/auth"
import { Button } from "./ui/button"
import { app } from "@/lib/firebase"
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import Link from "next/link";

export default function Nav() {

	const auth = getAuth(app);

	return (
		<nav className="p-2 flex flex-row justify-between">
			<h1 className="text-2xl">Chat@UnifiedMentor</h1>
			{auth && auth.currentUser ?
			<Button asChild>
				<Link href="/profile">
					<Avatar>
						<AvatarImage src={auth.currentUser.photoURL as string} />
					</Avatar>
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
