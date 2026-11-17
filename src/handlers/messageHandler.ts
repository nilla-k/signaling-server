import { RawData } from 'ws'
import { JoinedRoomMessage, MessageSchema, MessageType, PlayerConnectedMessage } from '../types/messages.js'
import { AppError, Either, left, right } from '../types/utils.js'
import { roomManager } from '../services/RoomManager.js'
import { Player } from '../services/models/Player.js'

export const handleMessage = (
	data: RawData,
	player: Player
): Either<AppError, string> => {
	try {
		const parsed = JSON.parse(data.toString())
		const result = MessageSchema.safeParse(parsed)
		if (!result.success) {
			console.error(`Invalid message schema received: ${JSON.stringify(result.error.issues)}`)
			throw new AppError("Invalid message schema received")
		}

		const message = result.data
		
		if (
			message.type !== MessageType.Answer &&
			message.type !== MessageType.Offer &&
			message.type !== MessageType.Candidate
		) {
			console.log(`Received message: ${data} from player ${player.id}`)
		}

		switch (message.type) {
			case MessageType.CreateRoom:
				if (message.data.playerName) {
					player.setName(message.data.playerName)
				}

				return roomManager.createRoom(player)

			case MessageType.JoinRoom: {
				if (message.data.playerName) {
					player.setName(message.data.playerName)
				}

				const roomId = message.data?.roomId
				if (!roomId) {
					return left(new AppError('Room ID missing from message body'))
				}

				const errorOrRoom = roomManager.joinRoom(roomId, player)
				if (errorOrRoom.tag === 'left') {
					return errorOrRoom
				}

				const room = errorOrRoom.value
				room.players.forEach((p) => {
					// send new player info to existing players
					const newPlayerConnected: PlayerConnectedMessage = {
						type: MessageType.PlayerConnected,
						data: {
							playerId: player.id,
							playerName: player.name,
							roomId: room.id,
						},
					}
					if (p.id !== player.id) {
						p.socket.send(JSON.stringify(newPlayerConnected))
					}

					// send existing player info to new player
					const existingPlayerConnected: PlayerConnectedMessage = {
						type: MessageType.PlayerConnected,
						data: {
							playerId: p.id,
							playerName: p.name,
							roomId: room.id,
						},
					}
					if (p.id !== player.id) {
						player.socket.send(JSON.stringify(existingPlayerConnected))
					}
				})

				const successMessage: JoinedRoomMessage = {
					type: MessageType.JoinedRoom,
					data: {
						roomId: room.id,
					},
				}

				return right(JSON.stringify(successMessage))
			}
			case MessageType.GetStatus:
				return right(roomManager.getStatus(player))

			case MessageType.Answer:
			case MessageType.Candidate:
			case MessageType.Offer: {
				// Pass data directly between peers for any message for establishing RTC connection
				const room = roomManager.getRoom(message.roomId)
				if (!room) {
					return left(new AppError('Error finding peer: room not found'))
				}

				const targetPlayer = room.players.get(message.peer.toString())

				if (!targetPlayer) {
					return left(new AppError('Error finding peer: player not found'))
				}

				targetPlayer.socket.send(JSON.stringify(message))

				return right('')
			}
			default:
				return left(new AppError('Received unknown or missing message type.'))
		}
	} catch (e: unknown) {
		if (e instanceof AppError) {
			return left(e)
		} else {
			return left(new AppError(`${e}`))
		}
	}
}
