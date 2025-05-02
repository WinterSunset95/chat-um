'use client'
import Nav from "@/components/Nav";
import HomePage from "@/components/HomePage";

export default function Home() {

	return (
		<div className="h-full w-full flex flex-col gap-2 p-4">
			<Nav />
			<HomePage />
		</div>
	);
}
