'use client'
import { useAuth } from "@/components/AuthProvider";
import Nav from "@/components/Nav";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogFooter, AlertDialogAction, AlertDialogCancel  } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { app } from "@/lib/firebase";
import { getAuth } from "firebase/auth";
import { collection, doc, getDoc, getFirestore } from "firebase/firestore";
import { CameraIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const Profile: React.FC = () => {

	const db = getFirestore(app);
	const router = useRouter();
	const user = useAuth();

	if (!user || !user.displayName) {
		router.replace("/login");
		return (
			<div>Loading . . .</div>
		)
	}

	const deleteFlow = () => {
		getAuth(app).currentUser.delete();
	}

	return (
		<div className="h-full w-full flex flex-col gap-8 p-4 items-center">
			<Nav />
			<div className="flex flex-col gap-4 justify-center items-center w-full max-w-96">
				<div className="w-48 h-48 flex justify-center items-center rounded-full overflow-hidden relative">
					<img src={user.photoURL ? user.photoURL : "https://picsum.photos/200"} className="w-full h-full object-cover" alt="" />
					<div className="absolute w-full h-1/3 bottom-0 bg-gradient-to-t from-black to-[rgba(0,0,0,0.5)] flex justify-center items-center">
						<CameraIcon className="transition-all hover:scale-150 cursor-pointer" color="white" />
					</div>
				</div>
				<div className="w-full flex flex-col gap-2">
					<Label>User ID</Label>
					<Input defaultValue={user.uid} readOnly/>
				</div>
				<div className="w-full flex flex-col gap-2">
					<Label>Username</Label>
					<Input defaultValue={user.displayName} readOnly/>
				</div>
				<div className="w-full flex flex-col gap-2">
					<Label>Username</Label>
					<Input defaultValue={user.email} readOnly/>
				</div>
				<div className="w-full flex flex-row gap-2 justify-center items-center">
					<Button onClick={() => getAuth(app).signOut()} className="grow cursor-pointer" >Logout</Button>
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
