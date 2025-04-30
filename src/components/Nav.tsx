import { Button } from "./ui/button"

export default function Nav() {
	return (
		<nav className="p-2 flex flex-row justify-between">
			<h1 className="text-2xl">Chat@UnifiedMentor</h1>
			<Button>Login</Button>
		</nav>
	)
}
