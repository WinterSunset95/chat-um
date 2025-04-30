import Image from "next/image";
import Nav from "@/components/Nav";
import { mockUsersList } from "@/lib/mock";
import UserList from "@/components/UserList";

export default function Home() {

	const users = mockUsersList();

	return (
		<div className="h-full w-full max-w-[1200px] bg-background p-4">
			<Nav />
			<UserList users={users} />
		</div>
	);
}
