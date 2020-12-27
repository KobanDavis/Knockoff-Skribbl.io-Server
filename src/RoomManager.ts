import { Server } from 'socket.io'
import Room from './Room'

interface RoomManagerInterface {
	create(io: Server, id: string): Room
	get(id: string): Room
}

type RoomsMap = Map<string, Room>

class RoomManager implements RoomManagerInterface {
	private rooms: RoomsMap = new Map()

	constructor(private _io: Server) {}

	public get(id: string): Room {
		return this.rooms.get(id)
	}
	public create(): Room {
		const randId = Math.random().toString(36).substr(3)
		const room = new Room(this._io, randId, () => this.delete(randId))
		this.rooms.set(randId, room)
		return room
	}
	public delete(id: string): void {
		this.rooms.delete(id)
	}
}

export default RoomManager
