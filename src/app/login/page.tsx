'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { app } from "@/lib/firebase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { connectAuthEmulator, getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import React, { FormEvent, useEffect } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

const Login: React.FC = () => {
	const auth = getAuth(app);
	const provider = new GoogleAuthProvider();
	const user = useAuth();

	const router = useRouter();

	const formHandle = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;

		if (!email || !password) {
			alert("Please enter email and password");
			return;
		}

		try {
			let result = await signInWithEmailAndPassword(auth, email, password);

			if (result.user) {
				alert("Sign in successful");
			} else {
				alert("Sign in failed");
			}
		} catch (error: any) {
			console.log(error);
			console.log(error.code);
			alert("Sign in failed: " + error.code);
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
			<form className="w-full" onSubmit={formHandle}>
				<Tabs defaultValue="email" className="w-full">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="email">Email</TabsTrigger>
						<TabsTrigger value="phone" disabled>Phone</TabsTrigger>
					</TabsList>

					<TabsContent value="email">
						<Card className="w-full">
							<CardHeader>
								<CardTitle>Sign in with your email</CardTitle>
								<CardDescription>Don't have an account? <a href="/signup" className="text-primary underline">Sign up</a></CardDescription>
							</CardHeader>
							<CardContent className="flex flex-col gap-2">
								<div>
									<Label htmlFor="email">Email</Label>
									<Input name="email" id="email" placeholder="Enter your email" />
								</div>
								<div>
									<Label htmlFor="password">Password</Label>
									<Input name="password" id="password" type="password" placeholder="Enter your password" />
								</div>
								<Button type="submit">Submit</Button>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="phone">
						<Card className="w-full">
							<CardHeader>
								<CardTitle>Sign in with your phone number</CardTitle>
								<CardDescription>Don't have an account? <a href="/signup" className="text-primary underline">Sign up</a></CardDescription>
							</CardHeader>
							<CardContent className="flex flex-col gap-2">
								<div>
									<Label htmlFor="phone">Phone</Label>
									<div className="flex flex-row gap-2">
										<Input id="phone" placeholder="Enter your phone number" />
										<Button>Send OTP</Button>
									</div>
								</div>
								<div>
									<Label htmlFor="otp">OTP</Label>
									<InputOTP maxLength={6} className="w-full flex">
										<InputOTPGroup className="w-full flex">
											<InputOTPSlot index={0} className="w-full"/>
											<InputOTPSlot index={1} className="w-full"/>
											<InputOTPSlot index={2} className="w-full"/>
											<InputOTPSlot index={3} className="w-full"/>
											<InputOTPSlot index={4} className="w-full"/>
											<InputOTPSlot index={5} className="w-full"/>
										</InputOTPGroup>
									</InputOTP>
								</div>
								<Button type="submit">Submit</Button>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>

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

export default Login;
