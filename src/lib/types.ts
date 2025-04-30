
// User Profile
type User = {
	uid: string;
	displayName: string;
	photoURL?: string;
	email?: string;
	status?: 'online' | 'offline' | 'away';
	createdAt: number;
	updatedAt: number;
}

// Message (In chat room or DM)
type Message = {
	id: string;
	senderId: string;
	senderName: string;
	content: string;
	timestamp: number;
	type?: 'text' | 'image' | 'file';
	reactions?: Record<string, string[]>; // emoji -> list of userIds
}

// Public room chat
type Room = {
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
type DM = {
	id: string;
	members: User[];
	lastMessage: Message;
	createdAt: number;
	updatedAt: number;
};

// Presence
type Presence = {
	userId: string;
	lastSeen: number;
	isOnline: boolean;
}
