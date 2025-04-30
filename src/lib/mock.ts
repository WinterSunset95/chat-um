import { faker } from '@faker-js/faker'

export const mockUsersList = (): User[] => {
	const users: User[] = []

	for (let i=0; i<=10; i++) {
		users.push({
			uid: faker.string.uuid(),
			displayName: faker.person.fullName(),
			photoURL: faker.image.url(),
			email: faker.internet.email(),
			status: 'online',
			createdAt: new Date().getTime(),
			updatedAt: new Date().getTime(),
		})
	}

	return users;
}
