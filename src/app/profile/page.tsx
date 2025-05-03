'use client'
import { useAuth } from "@/components/AuthProvider";
import Nav from "@/components/Nav";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogFooter, AlertDialogAction, AlertDialogCancel  } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { app } from "@/lib/firebase";
import { getAuth, updateProfile } from "firebase/auth";
import { collection, doc, getDoc, getFirestore, setDoc, updateDoc } from "firebase/firestore";
import { CameraIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";

const Profile: React.FC = () => {
	const auth = getAuth(app);
	const router = useRouter();
	const user = useAuth();
	const db = getFirestore(app);

	if (!auth.currentUser) {
		router.push("/login");
	}

	if (!user) {
		return (
			<div>Loading . . .</div>
		)
	}

	const deleteFlow = () => {
		auth.currentUser.delete();
	}

	const handleForm = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const newName = formData.get("displayName") as string;
		if (!newName) {
			alert("Please enter a display name");
			return;
		}
		await updateProfile(user, {
			displayName: newName
		})
		.then(() => {
			// Update the firestore entry
			const collectionRef = collection(db, "tenants", user.tenantId, "users");
			const userDocRef = doc(collectionRef, user.uid);
			updateDoc(userDocRef, { displayName: newName })
			.then(() => {
				alert("Profile updated");
				console.log("Profile updated");
			})
			.catch((error) => {
				console.log(error);
			})
		})
		.catch((error) => {
			console.log(error);
		})
	}

	return (
		<div className="h-full w-full flex flex-col gap-8 p-4 items-center">
			<Nav />
			<div className="flex flex-col gap-4 justify-center items-center w-full max-w-96">
				<form className="flex flex-col gap-4 w-full items-center" onSubmit={handleForm}>
					<div className="w-48 h-48 flex justify-center items-center rounded-full overflow-hidden relative">
						<img src={user.photoURL ? user.photoURL : "https://picsum.photos/200"} className="w-full h-full object-cover" alt="" />
						<div className="absolute w-full h-1/3 bottom-0 bg-gradient-to-t from-black to-[rgba(0,0,0,0.5)] flex justify-center items-center">
							<CameraIcon className="transition-all hover:scale-150 cursor-pointer" color="white" />
						</div>
					</div>
					<div className="w-full flex flex-col gap-2">
						<Label>User ID</Label>
						<Input defaultValue={user.uid} readOnly disabled/>
					</div>
					<div className="w-full flex flex-col gap-2">
						<Label>Username</Label>
						<Input name="displayName" defaultValue={user.displayName} />
					</div>
					<div className="w-full flex flex-col gap-2">
						<Label>Username</Label>
						<Input defaultValue={user.email} readOnly disabled/>
					</div>
					<Button className="self-start" type="submit">Update</Button>
				</form>
				<br />
				<div className="w-full flex flex-row gap-2 justify-center items-center">
					<Button onClick={() => auth.signOut()} className="grow cursor-pointer" >Logout</Button>
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button variant="destructive" className="grow cursor-pointer">Delete</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. This will permanently delete your account and remove your data from our servers.
							</AlertDialogDescription>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction onClick={deleteFlow}>Continue</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			</div>
		</div>
	)
}

export default Profile;
