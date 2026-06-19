import { Message, MessageType } from '../types/messages.ts'
import { Either, left, right } from '../types/utils.js'
import { Player } from './models/Player.js'
import { Room } from './models/Room.js'

class RoomManager {
	private rooms: Map<string, Room> = new Map<string, Room>()

	public createRoom = (player: Player): Either<Error, string> => {
		if (this.getPlayerRoom(player)) {
			return left(
				Error(
					`Cannot create room - already in room ${this.getPlayerRoom(player)?.id}`,
				),
			)
		}

		const newRoom = new Room()
		newRoom.players.push(player)

		this.rooms.set(newRoom.id, newRoom)

		const successMessage: Message = {
			type: MessageType.RoomCreated,
			data: {
				roomId: newRoom.id,
				hostId: player.id
			}
		}

		return right(JSON.stringify(successMessage))
	}

	public joinRoom = (roomId: string, player: Player): Either<Error, Room> => {
		const maybeRoom = this.rooms.get(roomId.toUpperCase())

		if (maybeRoom) {
			maybeRoom.players.push(player)
			return right(maybeRoom)
		} else {
			return left(Error(`Room ${roomId} not found`))
		}
	}

	public getRoom = (roomId: string) => {
		return this.rooms.get(roomId.toUpperCase())
	}

	public getStatus = (player: Player): string => {
		for (const [key, value] of this.rooms.entries()) {
			const isPlayerInRoom = value.players.some((p) => p.id === player.id)

			if (isPlayerInRoom) {
				return `Player in room ${key}`
			}
		}

		return 'Not joined room yet.'
	}

	private getPlayerRoom = (player: Player): Room | null => {
		for (const [, value] of this.rooms.entries()) {
			const isPlayerInRoom = value.players.some((p) => p.id === player.id)

			if (isPlayerInRoom) {
				return value
			}
		}

		return null
	}
}

export const roomManager = new RoomManager()
