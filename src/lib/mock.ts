import { faker } from '@faker-js/faker'
import { User } from 'firebase/auth';
import { Room } from './types';

export const mockUsersList = (): User[] => {
	const users: User[] = []

	return users;
}

export const mockRooms = (): Room[] => {
	const rooms: Room[] = [];

	for (let i=0; i<=10; i++) {
		rooms.push({
			id: faker.string.uuid(),
			name: faker.lorem.word(),
			description: faker.lorem.sentence(),
			createdAt: new Date().getTime(),
			updatedAt: new Date().getTime(),
			ownerId: faker.string.uuid(),
			ownerName: faker.person.fullName(),
			members: mockUsersList(),
		})
	}

	return rooms;
}
