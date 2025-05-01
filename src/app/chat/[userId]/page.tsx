import DirectMessage from "@/components/DirectMessage";
import Nav from "@/components/Nav";

export default async function Chat ({
	params,
}: {
	params: Promise<{ userId: string }>
}) {

	const { userId } = await params;

	return (
		<DirectMessage userId={userId} />
	)
}

