'use client'
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { app } from "@/lib/firebase";
import { connectAuthEmulator, createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import React, { FormEvent, useEffect } from "react";

const SignUp: React.FC = () => {

	const auth = getAuth(app);
	const provider = new GoogleAuthProvider();
	const user = useAuth();

	const router = useRouter();

	const formSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);

		const email = formData.get("email") as string;
		const password = formData.get("password") as string;
		const confirm = formData.get("confirm") as string;

		if (password !== confirm) {
			alert("Passwords do not match");
			return;
		}

		let result = await createUserWithEmailAndPassword(auth, email, password);

		if (result.user) {
			alert("Sign in successful");
		} else {
			alert("Sign in failed");
		}

	}

	const popUpSignin = async () => {
		try {
			let result = await signInWithPopup(auth, provider);
			if (result.user) {
				alert("Sign in successful");
			} else {
				alert("Sign in failed");
			}
		} catch (error: any) {
			console.log(error);
			console.log(error.code);
		}
	}

	if (user && user.uid) {
		alert("You are already signed in");
		router.replace("/");
	}

	return (
		<main className="w-full max-w-96">
			<form className="w-full" onSubmit={formSubmit}>
				<Card>
					<CardHeader>
						<CardTitle>Create an account for Chat UM</CardTitle>
						<CardDescription>Already have an account? <a href="/login" className="text-primary underline">Sign in</a></CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col gap-2">
						<div>
							<Label htmlFor="email">Email</Label>
							<Input name="email" id="email" placeholder="Enter your email" required/>
						</div>
						<div>
							<Label htmlFor="password">Password</Label>
							<Input name="password" id="password" type="password" placeholder="Enter your password" required/>
						</div>
						<div>
							<Label htmlFor="confirm">Confirm Password</Label>
							<Input name="confirm" id="confirm" type="password" placeholder="Enter your password" required/>
						</div>
						<Button type="submit">Submit</Button>
					</CardContent>
				</Card>
			</form>
			<br />
			<div className="flex flex-row gap-2 justify-center items-center">
				<div className="flex-1 border border-primary"></div>
				<div>OR</div>
				<div className="flex-1 border border-primary"></div>
			</div>
			<br />
			<div className="flex flex-col gap-2">
				<Button onClick={popUpSignin} className="w-full">
					Sign In with Google
				</Button>
			</div>
		</main>
	)
}

export default SignUp;
