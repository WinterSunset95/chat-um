'use client'
import { app } from "@/lib/firebase";
import { checkIfUserExistsOnDatabase } from "@/lib/setup";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext<User | null>(null);

export function AuthProvider({
	children
}: {
	children: React.ReactNode
}) {

	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {

		const auth = getAuth(app);
		const unsub = onAuthStateChanged(auth, (user) => {
			if (!user) {
				setUser(null);
				return;
			}
			checkIfUserExistsOnDatabase(auth, getFirestore(app));
			setUser({
				uid: user.uid,
				displayName: user.displayName as string,
				photoURL: user.photoURL as string,
				email: user.email as string,
				phoneNumber: user.phoneNumber as string,
				status: 'online',
				createdAt: Date.now(),
				updatedAt: Date.now(),
			});
		});

		return () => {
			unsub();
		};

	},[]);

	return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext);
