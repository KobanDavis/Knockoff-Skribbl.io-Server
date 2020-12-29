import { Router } from 'express'
import { Server } from 'socket.io'
import { createError, createResponse } from '../Response'
import RoomManager from '../RoomManager'
import { CheckRoomExistsBody, ExpressRequest } from './index.types'

export default (io: Server): Router => {
	const router = Router()
	router.post('/checkRoomExists', (req: ExpressRequest<CheckRoomExistsBody>, res) => {
		const { roomId } = req.body
		if (!roomId) {
			res.json(createError('Bad request: roomId missing or invalid'))
			return res.end()
		}

		const roomExists = RoomManager.get(roomId) !== undefined
		console.log('checkRoomExists', roomId, roomExists)

		res.json(createResponse(`Room does${roomExists ? '' : ' not'} exist`, roomExists))
		res.end()
	})

	router.post('/createRoom', (req: ExpressRequest<CheckRoomExistsBody>, res) => {
		const room = RoomManager.create(io)
		console.log('createRoom', room.id)

		res.json(createResponse(`Created room ${room.id}`, room.id))
		res.end()
	})

	return router
}
