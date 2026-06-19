import WebSocket from 'ws'

export class Player {
	readonly id: string = (
		Math.floor(Math.random() * 90000000) + 10000000
	).toString();
	
	socket: WebSocket

	constructor(socket: WebSocket) {
		this.socket = socket
	}
}
