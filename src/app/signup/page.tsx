'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { app } from "@/lib/firebase";
import { connectAuthEmulator, getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const SignUp: React.FC = () => {

	const auth = getAuth(app);
	auth.tenantId = "chat-um-bhulo";
	const provider = new GoogleAuthProvider();

	const router = useRouter();

	const emailSignIn = async () => {
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

	useEffect(() => {
		if (auth.currentUser) {
			alert("You are already signed in");
			router.replace("/");
		}
		onAuthStateChanged(auth, (user) => {
			if (user) {
				router.replace("/");
			}
		})
	}, [])

	return (
		<main className="w-full max-w-96">
			<form className="w-full">
				<Card>
					<CardHeader>
						<CardTitle>Create an account for Chat UM</CardTitle>
						<CardDescription>Already have an account? <a href="/login" className="text-primary underline">Sign in</a></CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col gap-2">
						<div>
							<Label htmlFor="fullname">Full Name</Label>
							<Input id="fullname" placeholder="Enter your full name" />
						</div>
						<div>
							<Label htmlFor="email">Email</Label>
							<Input id="email" placeholder="Enter your email" />
						</div>
						<div>
							<Label htmlFor="password">Password</Label>
							<Input id="password" type="password" placeholder="Enter your password" />
						</div>
						<div>
							<Label htmlFor="confirm">Confirm Password</Label>
							<Input id="confirm" type="password" placeholder="Enter your password" />
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
