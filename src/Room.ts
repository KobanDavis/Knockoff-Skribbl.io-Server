import User, { UserObject } from './User'
import { Server } from 'socket.io'

interface RoomInterface {
	addUser(user: User): void
	getAllUsers(): User[]
	getUser(id: string): User
	removeUser(user: User): void
}

class Room implements RoomInterface {
	private users: Map<string, User> = new Map()
	constructor(private _io: Server, public id: string, private _deleteSelf: () => void) {
		console.log(`Room created: ${this.id}`)
	}

	private updateClientUsers(): void {
		this._io.to(this.id).emit(
			'response/getUsers',
			this.getAllUsers().map((user) => user.toObject())
		)
	}

	public addUser(user: User): void {
		if (this.users.size === 0) {
			user.setHost()
		}
		user.setRoom(this)
		this.users.set(user.id, user)
		this.updateClientUsers()
	}

	public getAllUsers(): User[] {
		return [...this.users.values()]
	}

	public getUser(id: string): User {
		return this.users.get(id)
	}

	public removeUser(user: User): void {
		this.users.delete(user.id)
		if (this.users.size > 0) {
			this.updateClientUsers()
		} else {
			this._deleteSelf()
		}
	}
}

export default Room
