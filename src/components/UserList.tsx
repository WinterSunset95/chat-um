import React from "react"
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { SearchIcon, Turtle } from "lucide-react";
import Link from "next/link";
import { User } from "firebase/auth";
import { Room } from "@/lib/types";

const UserList: React.FC<{ users?: User[], rooms?: Room[] }> = ({ users, rooms }) => {

	if (!users && !rooms) {
		return (
			<main className="flex flex-col gap-2">
				<h1>'_' This was not supposed to happen</h1>
			</main>
		)
	}

	if (users && users.length > 0) {
		return (
			<ul className="flex flex-col gap-2">
				{users.map((user) => (
					<li key={user.uid}>
						<Link href={`/${users ? "chat" : "room"}/${user.uid}`}>
							<Card className="p-1">
								<CardContent className="p-1">
									<div className="flex flex-row gap-2 items-center">
										<Avatar>
											<AvatarImage src={user.photoURL ? user.photoURL : "https://picsum.photos/200"} />
											<AvatarFallback>U</AvatarFallback>
										</Avatar>
										<div>
											<p>{user.displayName}</p>
											<p>{user.email}</p>
										</div>
									</div>
								</CardContent>
							</Card>
						</Link>
					</li>
				))}
			</ul>
		)
	}

	if (rooms && rooms.length > 0) {
		return (
			<ul className="flex flex-col gap-2 w-full overflow-y-auto">
				{rooms.map((room) => (
					<li key={room.id}>
						<Link href={`/room/${room.id}`}>
							<Card className="p-1">
								<CardContent className="p-1">
									<div className="flex flex-row gap-2 items-center">
										<Avatar>
											<AvatarImage src="https://picsum.photos/200" />
											<AvatarFallback>U</AvatarFallback>
										</Avatar>
										<div>
											<h1 className="font-bold text-lg">{room.name}</h1>
											<p>{room.members.length} members</p>
										</div>
									</div>
								</CardContent>
							</Card>
						</Link>
					</li>
				))}
			</ul>
		)
	}

	return (
		<main className="flex flex-col gap-2 w-full h-full items-center justify-center">
			<Turtle size={64} />
			<h1>Wow, such empty</h1>
		</main>
	)
}

export default UserList;
