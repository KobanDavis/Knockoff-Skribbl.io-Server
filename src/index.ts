import http from 'http'
import SocketIO, { Socket } from 'socket.io'
import RoomManager from './RoomManager'
import User from './User'

const port = Number(process.env.PORT) || 8080

const server = http.createServer((req, res) => {
	res.write('Online')
	res.end()
})
server.listen(port, () => console.log(`Server started on port ${port}`))

const io = new SocketIO.Server(server, { cors: { origin: '*' } })
const roomManager = new RoomManager(io)

io.on('connection', async (socket: Socket) => {
	socket.on('checkRoomExists', ({ roomId }) => {
		const roomExists = roomManager.get(roomId) !== undefined
		console.log('checkRoomExists', roomId, roomExists)
		socket.emit('response/checkRoomExists', roomExists)
	})
	socket.on('createRoom', () => {
		const room = roomManager.create()
		console.log('createRoom', room.id)
		socket.emit('response/createRoom', room.id)
	})
	socket.on('joinRoom', ({ id, name, roomId }) => {
		console.log('joinRoom', name, roomId)
		const user = new User(id, socket, name)
		const room = roomManager.get(roomId)
		room.addUser(user)
		socket.emit('response/joinRoom')
	})
	socket.on('getUsers', ({ roomId }) => {
		console.log('getUsers', roomId)

		const room = roomManager.get(roomId)
		const users = room.getAllUsers().map((user) => user.toObject())
		console.log(users)
		socket.emit('response/getUsers', users)
	})
	socket.on('getUser', ({ roomId, id }) => {
		console.log('getUser', id)

		const room = roomManager.get(roomId)
		const user = room?.getUser(id).toObject()
		console.log(user)
		socket.emit('response/getUser', user)
	})
	socket.on('reconnectUser', ({ roomId, id }) => {
		console.log('reconnectUser', id)

		const room = roomManager.get(roomId)
		const user = room.getUser(id)
		user.reconnect(socket)
		console.log(user.toObject())
		socket.emit('response/reconnectUser')
	})
})
