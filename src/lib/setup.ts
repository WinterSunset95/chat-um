import { Auth } from "firebase/auth";
import { collection, doc, Firestore, getDoc, setDoc } from "firebase/firestore";

// Check if the collection exists based on the schema we have in types.ts
// Update: Switched to a firebase function
export const checkFirestore = async (auth: Auth, db: Firestore) => {
	return;
	const tenantId = auth.tenantId;
	if (!tenantId) {
		return false;
	}

	// First check if the document tenantId exists in collection "tenants"
	const tenantsCollection = collection(db, "tenants");
	const docRef = doc(tenantsCollection, tenantId);
	const docSnap = await getDoc(docRef);

	if (docSnap.exists()) {
		console.log("Document data:", docSnap.data());
		return true;
	}

	// If it doesn't exist, create it. along with subcollections users, messages and rooms
	setDoc(docRef, { createdAt: Date.now(), }, { merge: true });

	return true;
}

// Check if the user exists on the database
// Update: Switched to a firebase function
export const checkIfUserExistsOnDatabase = async (auth: Auth, db: Firestore) => {
	return;
	const tenantId = auth.tenantId;
	if (!tenantId) {
		return false;
	}

	const usersCollection = collection(db, "tenants", tenantId, "users");
	const docRef = doc(usersCollection, auth.currentUser.uid as string);
	const docSnap = await getDoc(docRef);

	if (docSnap.exists()) {
		console.log("Document data:", docSnap.data());
		return true;
	}

	return false;
}
