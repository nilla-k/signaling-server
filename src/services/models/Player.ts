import WebSocket from 'ws'

export class Player {
	readonly id: string = Math.random().toString().substring(2, 10)
	socket: WebSocket

	constructor(socket: WebSocket) {
		this.socket = socket
	}
}
