import { Message, MessageType } from '../types/messages.ts'
import { Either, left, right } from '../types/utils.js'
import { Player } from './models/Player.js'
import { Room } from './models/Room.js'

/**
 * Singleton used for managing the creation and joining of rooms. 
 */
class RoomManager {
	private rooms: Map<string, Room> = new Map<string, Room>()

	/**
	 * 
	 * @param player - Player which is creating the room.
	 * @returns A string with RoomCreated message containing room ID and host ID on success, Error if player is already in an existing room.
	 */
	public createRoom = (player: Player): Either<Error, string> => {
		if (this.getPlayerRoom(player)) {
			return left(
				Error(
					`Cannot create room - already in room ${this.getPlayerRoom(player)?.id}`
				)
			)
		}

		const newRoom = new Room()
		newRoom.players.set(player.id, player)

		this.rooms.set(newRoom.id, newRoom)

		const successMessage: Message = {
			type: MessageType.RoomCreated,
			data: {
				roomId: newRoom.id,
				hostId: player.id,
			},
		}

		return right(JSON.stringify(successMessage))
	}

	/**
	 * Adds player to room
	 * @param roomId - ID of room to join
	 * @param player - Player object to add
	 * @returns Room that was joined on sucess, Error if room is not found
	 */
	public joinRoom = (roomId: string, player: Player): Either<Error, Room> => {
		const maybeRoom = this.rooms.get(roomId.toUpperCase())

		if (maybeRoom) {
			maybeRoom.players.set(player.id, player)
			return right(maybeRoom)
		} else {
			return left(Error(`Room ${roomId} not found`))
		}
	}

	/**
	 * Get room by ID.
	 * @param roomId 
	 * @returns Room object if exists
	 */
	public getRoom = (roomId: string) => {
		return this.rooms.get(roomId.toUpperCase())
	}

	/**
	 * Check whether a player has joined a room.
	 * @param player - Player object to check
	 * @returns String message indicating player status.
	 */
	public getStatus = (player: Player): string => {
		for (const [key, value] of this.rooms.entries()) {
			const maybePlayer = value.players.get(player.id)

			if (maybePlayer) {
				return `Player in room ${key}`
			}
		}

		return 'Not joined room yet.'
	}

	private getPlayerRoom = (player: Player): Room | null => {
		for (const [, value] of this.rooms.entries()) {
			const maybePlayer = value.players.get(player.id)

			if (maybePlayer) {
				return value
			}
		}

		return null
	}
}

export const roomManager = new RoomManager()
