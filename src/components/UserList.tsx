import React from "react"

const UserList: React.FC<{ users: User[] }> = ({ users }) => {
	console.log(users)
	return (
		<ul>
			{users.map((user) => (
				<li key={user.uid}>{user.displayName}</li>
			))}
		</ul>
	)
}

export default UserList;
