import { Player } from './Player.ts'

/**
 * A room which players can join to establish peer-to-peer connection.
 *
 * @readonly id - A randomly generated six character alphanumeric ID.
 * @property hostId - Player ID of the room's creator
 * @property players - Map of players by ID associated with this room.
 */
export class Room {
	readonly id: string = Math.random().toString(36).substring(2, 8).toUpperCase()
	hostId: string
	players: Map<string, Player> = new Map<string, Player>()

	/**
	 * 
	 * @param hostPlayer Player who creates the room. Will be used as host player.
	 */
	constructor(hostPlayer: Player) {
		this.hostId = hostPlayer.id
		this.players.set(hostPlayer.id, hostPlayer)
	}

	/**
	 * 
	 * @param player Player object to add to room
	 */
	public addPlayer(player: Player) {
		this.players.set(player.id, player)
	}

}
