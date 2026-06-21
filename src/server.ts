import { WebSocketServer } from 'ws'
import { handleMessage } from './handlers/messageHandler.ts'
import { Either } from './types/utils.ts'
import { Player } from './services/models/Player.ts'
import { Message, MessageType } from './types/messages.ts'

const port = Number(process.env.port) || 8080
const server = new WebSocketServer({ port: port })

server.on('connection', (socket) => {
	const player = new Player(socket)

	// Acknowledge connection success
	console.log(`New client connected! Player ID ${player.id}`)
	const startMessage: Message = {
		type: MessageType.ConnectionStart,
		data: {
			id: player.id,
		},
	}
	socket.send(JSON.stringify(startMessage))

	// Message handling
	socket.on('message', (data) => {
		console.log(`Received message: ${data} from player ${player.id}`)

		const response: Either<Error, string> = handleMessage(data, player)

		if (response.tag === 'left') {
			const errorMessage: Message = {
				type: MessageType.Error,
				data: {
					message: response.error.message,
				},
			}
			socket.send(JSON.stringify(errorMessage))
		} else {
			socket.send(response.value)
		}
	})

	socket.on('close', () => {
		// TODO: Cleanup hosted rooms on connection close
		console.log(`Player ${player.id} has disconnected.`)
	})
})

console.log(`WebSocket server is running on ws://localhost:${port}`)
