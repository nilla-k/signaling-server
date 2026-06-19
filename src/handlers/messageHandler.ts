import { RawData } from 'ws'
import { Message, MessageType } from '../types/messages.js'
import { Either, left, right } from '../types/utils.js'
import { roomManager } from '../services/RoomManager.js'
import { Player } from '../services/models/Player.js'

export const handleMessage = (
	data: RawData,
	player: Player,
): Either<Error, string> => {
	try {
		const message = JSON.parse(data.toString())

		switch (message.type) {
			case MessageType.CreateRoom:
				return roomManager.createRoom(player)

			case MessageType.JoinRoom: {
				const roomId = message.data?.id
				if (roomId) {
					const errorOrRoom = roomManager.joinRoom(roomId, player)
					if (errorOrRoom.tag === 'right') {
						const room = errorOrRoom.value

						room.players.forEach((p) => {
							// send new player info to existing players
							const newPlayerMessage: Message = {
								type: MessageType.PlayerConnected,
								data: {
									id: player.id,
									room: room.id
								}
							}
							if (p.id !== player.id) {
								p.socket.send(JSON.stringify(newPlayerMessage))
							}
							
							// send existing player info to new player
							const existingPlayersMessage: Message = {
								type: MessageType.PlayerConnected,
								data: {
									id: p.id,
									room: room.id
								}
							}
							if (p.id !== player.id) {
								player.socket.send(JSON.stringify(existingPlayersMessage))
							}
						})

						return right('Joined successfully')
					} else {
						return errorOrRoom
					}
				} else {
					return left(Error('Room ID missing from message body'))
				}
			}
			case MessageType.GetStatus:
				return right(roomManager.getStatus(player))

			case MessageType.Answer:
			case MessageType.Candidate:
			case MessageType.Offer: {
				// Pass data directly between peers for any message for establishing RTC connection
				const room = roomManager.getRoom(message.roomId)
				const targetPlayer = room?.players.find((p) => p.id === message.peer)

				if (targetPlayer) {
					targetPlayer.socket.send(JSON.stringify(message))
				} else {
					return left(Error("Error finding peer"))
				}

				return right("")
			}
			default:
				return left(Error('Received unknown or missing message type.'))
		}
	} catch (e) {
		return left(Error(`${e}`))
	}
}
