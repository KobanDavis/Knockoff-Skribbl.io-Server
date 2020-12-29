import express from 'express'
import cors from 'cors'
import router from './routes/index'
import { Server } from 'socket.io'

export default (io: Server): express.Express => {
	const app = express()

	app.use(cors())
	app.use(express.json())
	app.use('/', router(io))

	return app
}
