import React from "react"
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { SearchIcon } from "lucide-react";

const UserList: React.FC<{ users: User[] }> = ({ users }) => {
	console.log(users)
	return (
		<main className="flex flex-col gap-1">
			<div className="flex flex-row justify-center items-center p-1 gap-1 border border-primary rounded-md">
				<input type="text" placeholder="Search user" className="bg-transparent border-0 w-full p-1"/>
				<SearchIcon />
			</div>
			<ul className="flex flex-col gap-1">
				{users.map((user) => (
					<li key={user.uid}>
						<Card className="p-1">
							<CardContent className="p-1">
								<div className="flex flex-row gap-1">
									<div className="flex justify-center items-center w-12 h-12 rounded-full overflow-hidden">
										<img className="object-cover w-full h-full" src={user.photoURL} alt={user.displayName} />
									</div>
									<div>
										<p>{user.displayName}</p>
										<p>{user.email}</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</li>
				))}
			</ul>
		</main>
	)
}

export default UserList;
