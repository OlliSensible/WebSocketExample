const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

const wss = new WebSocket.Server({ port: 8080 });

const clients = {};

wss.on('connection', function connection(ws) {
  const userId = uuidv4();
  clients[userId] = ws;

  console.log(`New client connected: ${userId}`);

  ws.on('message', function incoming(message) {
    console.log(`Received message from ${userId}: ${message}`);
    Object.values(clients).forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(`User ${userId}: ${message}`);
      }
    });
  });

  ws.on('close', function() {
    console.log(`Client disconnected: ${userId}`);
    delete clients[userId];
  });
});

console.log("WebSocket server is running on ws://localhost:8080");
