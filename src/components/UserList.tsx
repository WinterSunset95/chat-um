import React from "react"
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { SearchIcon } from "lucide-react";
import Link from "next/link";

const UserList: React.FC<{ users: User[] }> = ({ users }) => {
	console.log(users)
	return (
		<main className="flex flex-col gap-2">
			<div className="flex flex-row justify-center items-center p-1 gap-1 border border-primary rounded-md">
				<input type="text" placeholder="Search user" className="bg-transparent border-0 w-full p-1"/>
				<SearchIcon />
			</div>
			<ul className="flex flex-col gap-2">
				{users.map((user) => (
					<li key={user.uid}>
						<Link href={`/chat/${user.uid}`}>
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
		</main>
	)
}

export default UserList;
