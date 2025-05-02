'use client'
import { app } from "@/lib/firebase";
import { checkIfUserExistsOnDatabase } from "@/lib/setup";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { collection, getFirestore } from "firebase/firestore";
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
			// Check if the user exists on the database
			setUser(user);
		});

		return () => {
			unsub();
		};

	},[]);

	return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext);
