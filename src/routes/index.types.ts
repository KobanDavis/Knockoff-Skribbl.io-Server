import { Request } from 'express'

export interface ExpressRequest<T> extends Request {
	body: T
}

export interface CheckRoomExistsBody {
	roomId: string
}
