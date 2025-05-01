'use client'
import { app } from "@/lib/firebase";
import { getAuth } from "firebase/auth";
import { collection, doc, getDoc, getFirestore } from "firebase/firestore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react"

const Profile: React.FC = () => {

	const auth = getAuth(app);
	const db = getFirestore(app);
	const router = useRouter();

	const [userData, setUserData] = useState<User | null>(null);

	useEffect(() => {
		if (!auth.currentUser) {
			router.replace("/login");
		}
		const tenantId = auth.tenantId;

		const usersCollection = collection(db, "tenants", tenantId, "users");
		const docRef = doc(usersCollection, auth.currentUser.uid as string);
		getDoc(docRef)
		.then((docSnap) => {
			if (docSnap.exists()) {
				setUserData(docSnap.data() as User);
			} else {
				throw new Error("User not found");
			}
		})
		.catch((error) => {
			alert(error.message);
		})
	},[]);

	if (!userData) {
		return (
			<div>Loading...</div>
		)
	}

	return (
		<div>
			<h1>{userData.displayName}</h1>
			<h1>This is the users page</h1>
		</div>
	)
}

export default Profile;
