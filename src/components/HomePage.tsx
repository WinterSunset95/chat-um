'use client'
import { app } from "@/lib/firebase";
import { addDoc, arrayUnion, collection, doc, getDocs, getFirestore, onSnapshot, query, setDoc } from "firebase/firestore";
import { PlusIcon, SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import UserList from "./UserList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { AlertDialogTitle, AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogTrigger, AlertDialogCancel, AlertDialogAction } from "./ui/alert-dialog";
import { Input } from "./ui/input";
import { generateCombinedUid } from "@/lib/helpers";
import { useAuth } from "./AuthProvider";
import { User } from "firebase/auth";
import { Room } from "@/lib/types";

export default function HomePage() {

	const db = getFirestore(app);

	const [usersList, setUsersList] = useState<User[]>([]);
	const [usersListOriginal, setUsersListOriginal] = useState<User[]>([]);
	const [rooms, setRooms] = useState<Room[]>([]);
	const [roomsOriginal, setRoomsOriginal] = useState<Room[]>([]);
	const [roomName, setRoomName] = useState<string>("");
	const [roomDesc, setRoomDesc] = useState<string>("");
	const [search, setSearch] = useState<string>("");
	const user = useAuth();

	useEffect(() => {
		const usersCollection = collection(db, "tenants", "chat-um-bhulo", "users");
		const roomsCollection = collection(db, "tenants", "chat-um-bhulo", "rooms");
		getDocs(usersCollection)
		.then((snapshot) => {
			setUsersList([]);
			snapshot.forEach((doc) => {
				setUsersList((prev) => [...prev, doc.data() as User]);
				setUsersListOriginal((prev) => [...prev, doc.data() as User]);
			})
		})
		getDocs(roomsCollection)
		.then((snapshot) => {
			setRooms([]);
			snapshot.forEach((doc) => {
				setRooms((prev) => [...prev, doc.data() as Room]);
				setRoomsOriginal((prev) => [...prev, doc.data() as Room]);
			})
		})

		const q = query(usersCollection);
		const rq = query (roomsCollection);

		const unsub = onSnapshot(q, (snapshot) => {
			setUsersList([]);
			snapshot.forEach((doc) => {
				setUsersList((prev) => [...prev, doc.data() as User]);
			})
		});

		const runsub = onSnapshot(rq, (snapshot) => {
			setRooms([]);
			snapshot.forEach((doc) => {
				setRooms((prev) => [...prev, doc.data() as Room]);
			})
		});

		return () => {
			unsub();
			runsub();
		}
	}, [])

	useEffect(() => {
		// Filter rooms and usersList based on search
		const filteredRooms = roomsOriginal.filter((room) => room.name.toLowerCase().includes(search.toLowerCase()));
		const filteredUsers = usersListOriginal.filter((user) => user.displayName.toLowerCase().includes(search.toLowerCase()));
		setRooms(filteredRooms);
		setUsersList(filteredUsers);
	}, [search]);

	const roomCreate = () => {
		if (!user) {
			alert("Please login to create a room");
			return
		}

		if (roomName === "" || roomDesc === "") {
			alert("Please enter a room name and description");
			return;
		}

		// First look for room with similar name
		const room = rooms.find((room) => room.name === roomName);
		if (room) {
			alert("Room already exists");
			return;
		}

		// RoomId = userId + roomname(lower, no spaces, no special chars, spaces and special chars are replaced by -)
		const roomId = generateCombinedUid(user.uid, roomName.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-'));
		console.log(roomId);
		// Create room
		const roomsCollection = collection(db, "tenants", user.tenantId, "rooms");
		const docRef = doc(roomsCollection, roomId);
		setDoc(docRef, {
			id: roomId,
			name: roomName,
			description: roomDesc,
			createdAt: Date.now(),
			updatedAt: Date.now(),
			ownerId: user.uid,
			ownerName: user.displayName,
			members: arrayUnion({
				uid: user.uid,
				displayName: user.displayName,
				photoURL: user.photoURL,
				email: user.email,
				phoneNumber: user.phoneNumber,
				createdAt: user.metadata.creationTime,
				updatedAt: user.metadata.lastSignInTime,
			}),
		})
		.then(() => {
			setRoomName("");
			setRoomDesc("");
			alert("Room created");
		})
	}

	return (
		<main className="flex flex-col gap-2 w-full flex-1 overflow-auto">
			<div className="flex flex-row justify-center items-center p-1 gap-1 border border-primary rounded-md">
				<input type="text" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent border-0 w-full p-1"/>
				<SearchIcon />
			</div>
			<Tabs defaultValue="users" className="w-full flex-1 overflow-auto flex flex-col">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="users">Users</TabsTrigger>
					<TabsTrigger value="rooms">Rooms</TabsTrigger>
				</TabsList>

				<TabsContent value="users" className="w-full flex-1 overflow-auto flex flex-col">
					<UserList users={usersList}/>
				</TabsContent>

				<TabsContent value="rooms" className="w-full flex-1 overflow-auto flex flex-col relative">
					<UserList rooms={rooms} />
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button className="absolute bottom-2 right-2 w-16 h-16 rounded-full">
								<PlusIcon size={128} />
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogTitle>Create Room</AlertDialogTitle>
							<AlertDialogDescription>Enter a room name to create</AlertDialogDescription>
							<div className="flex flex-col gap-2">
								<Input placeholder="Room Name" value={roomName} onChange={(e) => setRoomName(e.target.value)} />
								<Input placeholder="Description" value={roomDesc} onChange={(e) => setRoomDesc(e.target.value)} />
							</div>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction onClick={roomCreate}>Create</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</TabsContent>
			</Tabs>
		</main>
	)
}
