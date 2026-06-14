import {WebSocketServer} from 'ws';

const server = new WebSocketServer({port: 8080})

server.on('connection', (socket) => {
  console.log('New client connected!');

  // Listen for incoming messages from the client
  socket.on('message', (message) => {
    console.log(`Received message: ${message}`);
    
    // Send a response back to the client
    socket.send(`Server received: ${message}`);
  });

  // Handle client disconnection
  socket.on('close', () => {
    console.log('Client has disconnected.');
  });
});

console.log('WebSocket server is running on ws://localhost:5000');
