import { Socket } from 'socket.io'
import Room from './Room'

interface UserInterface {
	id: string
	isHost: boolean
	toObject(): UserObject
	setRoom(room: Room): void
	getRoom(): Room
	leaveRoom(): void
	reconnect(socket: Socket): void
	setHost(): void
}

export interface UserObject {
	name: string
	id: string
	isHost: boolean
}

class User implements UserInterface {
	public isHost: boolean = false
	private _room: Room = null
	private disconnectTimer: NodeJS.Timeout

	constructor(public id: string, private _socket: Socket, private _name: string) {
		this.handleDisconnect()
	}

	private handleDisconnect(): void {
		this._socket.on('disconnect', () => {
			this.disconnectTimer = setTimeout(this.leaveRoom.bind(this), 10000)
		})
	}

	public toObject(): UserObject {
		return { name: this._name, id: this.id, isHost: this.isHost }
	}

	public setRoom(room: Room): void {
		if (this._room) {
			this.leaveRoom()
			this._socket.leave(this._room.id)
		}
		this._socket.join(room.id)
		console.log('join room', room.id, this._name)
		this._room = room
	}

	public getRoom(): Room {
		return this._room
	}

	public leaveRoom(): void {
		console.log('disconnect', this._name)
		this._room?.removeUser(this)
	}

	public reconnect(socket: Socket): void {
		this._socket = socket
		this._socket.join(this._room.id)
		clearTimeout(this.disconnectTimer)
		this.handleDisconnect()
	}

	public setHost(): void {
		this.isHost = true
	}
}

export default User
