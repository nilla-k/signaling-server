import WebSocket from 'ws'

/**
 * Represents a connected peer.
 * 
 * @readonly id - Randomly generated 8 digit numerical ID, beginning with non-zero number.
 * @param socket - WebSocket assigned to this peer. Used to send data to peer.
 */
export class Player {
	readonly id: string = (
		Math.floor(Math.random() * 90000000) + 10000000 // generate such that ID never begins with 0
	).toString()

	socket: WebSocket

	constructor(socket: WebSocket) {
		this.socket = socket
	}
}
