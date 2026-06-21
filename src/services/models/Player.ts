import WebSocket from 'ws'

/**
 * Represents a connected peer.
 *
 * @readonly id - Randomly generated 8 digit numerical ID, beginning with non-zero number.
 * @param socket - WebSocket assigned to this peer. Used to send data to peer.
 */
export class Player {
	readonly id: string = (Math.floor(Math.random() * 90000000) + 10000000) 
		.toString()

	socket: WebSocket
	name: string = `Player ${this.id}`

	constructor(socket: WebSocket) {
		this.socket = socket
	}

	public setName(newName: string) {
		this.name = newName
	}
}
