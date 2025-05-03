'use client'
import { useAuth } from "@/components/AuthProvider";
import DirectMessage from "@/components/DirectMessage";
import { Button } from "@/components/ui/button";
import { app } from "@/lib/firebase";
import { User } from "firebase/auth";
import { collection, doc, getDoc, getFirestore } from "firebase/firestore";
import { TurtleIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Chat () {
	const [them, setThem] = useState<User | null>(null);
	const { userId } = useParams();
	const me = useAuth();
	const db = getFirestore(app);

	useEffect(() => {
		if (!userId) {
			return;
		}
		const usersCollection = collection(db, "tenants", "chat-um-bhulo", "users");
		const docRef = doc(usersCollection, userId as string);
		getDoc(docRef)
		.then((docSnap) => {
			if (docSnap.exists()) {
				setThem(docSnap.data() as User);
			}
		})
		.catch((error) => {
			console.log("Error getting document:", error);
		});
	}, [userId]);

	if (!userId) {
		return (
			<div>404</div>
		)
	}

	if (!them || !me) {
		return (
			<div className="flex flex-col justify-center items-center gap-4">
				<TurtleIcon size={64} />
				<h1>You need to be logged in to access this page</h1>
				<Button>
					<Link href="/login">Click here to login</Link>
				</Button>
			</div>
		)
	}


	return (
		<DirectMessage me={me} them={them} />
	)
}

