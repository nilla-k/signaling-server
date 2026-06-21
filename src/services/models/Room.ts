import { Player } from './Player.ts'

/**
 * A room which players can join to establish peer-to-peer connection.
 *
 * @readonly id - A randomly generated six character alphanumeric ID.
 * @property players - Map of players by ID associated with this room.
 */
export class Room {
	readonly id: string = Math.random().toString(36).substring(2, 8).toUpperCase()
	players: Map<string, Player> = new Map<string, Player>()
}
