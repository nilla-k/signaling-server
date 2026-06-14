import {WebSocketServer} from 'ws';
import { handleMessage } from './handlers/messageHandler.js';
import { Either } from './types/utils.js';

const server = new WebSocketServer({port: 8080})

server.on('connection', (socket) => {
  console.log('New client connected!');

  socket.on('message', (data) => {
    console.log(`Received message: ${data}`);
    
    const response: Either<Error, string> = handleMessage(data)

    if (response.tag === 'left') {
      socket.send(`Error: ${response.error.message}`)
    } else {
      socket.send(response.value)
    }
  });


  socket.on('close', () => {
    console.log('Client has disconnected.');
  });
});

console.log('WebSocket server is running on ws://localhost:5000');
