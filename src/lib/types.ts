import { User } from "firebase/auth";

// Message (In chat room or DM)
export type Message = {
	id: string;
	senderId: string;
	senderName: string;
	content: string;
	timestamp: number;
	type?: 'text' | 'image' | 'file';
	reactions?: Record<string, string[]>; // emoji -> list of userIds
}

// Public room chat
export type Room = {
	id: string;
	name: string;
	description?: string;
	createdAt: number;
	updatedAt: number;
	ownerId: string;
	ownerName: string;
	members: User[];
};

// DM Thread
export type DM = {
	id: string;
	members: User[];
	lastMessage: Message;
	createdAt: number;
	updatedAt: number;
};

// Presence
export type Presence = {
	userId: string;
	lastSeen: number;
	isOnline: boolean;
}
