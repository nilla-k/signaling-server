import { RawData } from 'ws'
import { Message, MessageType } from '../types/messages.js'
import { Either, left, right } from '../types/utils.js'
import { roomManager } from '../services/RoomManager.js'
import { Player } from '../services/models/Player.js'

export const handleMessage = (
	data: RawData,
	player: Player
): Either<Error, string> => {
	try {
		const message = JSON.parse(data.toString())

		switch (message.type) {
			case MessageType.CreateRoom:
				if (message.data.name) {
					player.setName(message.data.name)
				}

				return roomManager.createRoom(player)

			case MessageType.JoinRoom: {
				if (message.data.name) {
					player.setName(message.data.name)
				}

				const roomId = message.data?.roomId
				if (!roomId) {
					return left(Error('Room ID missing from message body'))
				}

				const errorOrRoom = roomManager.joinRoom(roomId, player)
				if (errorOrRoom.tag === 'left') {
					return errorOrRoom
				}

				const room = errorOrRoom.value
				room.players.forEach((p) => {
					// send new player info to existing players
					const newPlayerConnected: Message = {
						type: MessageType.PlayerConnected,
						data: {
							playerId: player.id,
							playerName: player.name,
							room: room.id,
						},
					}
					if (p.id !== player.id) {
						p.socket.send(JSON.stringify(newPlayerConnected))
					}

					// send existing player info to new player
					const existingPlayerConnected: Message = {
						type: MessageType.PlayerConnected,
						data: {
							playerId: p.id,
							playerName: p.name,
							room: room.id,
						},
					}
					if (p.id !== player.id) {
						player.socket.send(JSON.stringify(existingPlayerConnected))
					}
				})

				const successMessage: Message = {
					type: MessageType.JoinedRoom,
					data: {
						room: room.id,
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
					return left(Error('Error finding peer: room not found'))
				}

				const targetPlayer = room.players.get(message.peer.toString())

				if (!targetPlayer) {
					return left(Error('Error finding peer: player not found'))
				}

				targetPlayer.socket.send(JSON.stringify(message))

				return right('')
			}
			default:
				return left(Error('Received unknown or missing message type.'))
		}
	} catch (e) {
		return left(Error(`${e}`))
	}
}
