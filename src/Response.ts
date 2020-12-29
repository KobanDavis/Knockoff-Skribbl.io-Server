interface APIResponse<T> {
	text: string
	isError: boolean
	data: T
}

const createResponse = <T>(text: string, data: T): APIResponse<T> => ({
	text,
	isError: false,
	data,
})

const createError = (text: string): APIResponse<null> => ({
	text,
	isError: true,
	data: null,
})

export type { APIResponse }
export { createResponse, createError }
