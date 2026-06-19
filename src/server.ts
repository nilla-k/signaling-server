import { WebSocketServer } from 'ws'
import { handleMessage } from './handlers/messageHandler.ts'
import { Either } from './types/utils.ts'
import { Player } from './services/models/Player.ts'

const port = 8080
const server = new WebSocketServer({ port: port })

server.on('connection', (socket) => {
	const player = new Player(socket)

	console.log(`New client connected! Player ID ${player.id}`)

	socket.on('message', (data) => {
		console.log(`Received message: ${data} from player ${player.id}`)

		const response: Either<Error, string> = handleMessage(data, player)

		if (response.tag === 'left') {
			socket.send(`Error: ${response.error.message}`)
		} else {
			socket.send(response.value)
		}
	})

	socket.on('close', () => {
		console.log(`Player ${player.id} has disconnected.`)
	})
})

console.log(`WebSocket server is running on ws://localhost:${port}`)
