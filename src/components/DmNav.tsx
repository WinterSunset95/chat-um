'use client'
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { Link, Moon, Sun } from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";

export default function DmNav({ me, them }: { me: User, them: User }) {

	const theme = useTheme();

	return (
		<nav className="p-2 flex flex-row justify-between gap-2">
			<div className="flex flex-row gap-2 grow">
				<Avatar>
					<AvatarImage src={them.photoURL ? them.photoURL : "https://picsum.photos/200"} />
				</Avatar>
				<h1>{them.displayName}</h1>
			</div>

			<Button onClick={() => {
				theme.setTheme(theme.theme === "dark" ? "light" : "dark");
			}}>
				<Sun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
				<Moon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
			</Button>

			<Button asChild>
				<Link href="/profile">
					<h1>{me.displayName}</h1>
				</Link>
			</Button>
		</nav>
	)
}
