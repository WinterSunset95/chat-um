import DirectMessage from "@/components/DirectMessage";
import Nav from "@/components/Nav";

export default async function Chat ({
	params,
}: {
	params: Promise<{ userId: string }>
}) {

	const { userId } = await params;

	return (
		<div className="h-full max-h-dvh w-full flex flex-col">
			<Nav chatId={userId} />
			<DirectMessage userId={userId} />
		</div>
	)
}

