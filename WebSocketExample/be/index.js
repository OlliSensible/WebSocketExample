const { WebSocketServer, WebSocket } = require('ws');
const http = require('http');
const { v4: uuidv4 } = require('uuid');

const server = http.createServer();
const wsServer = new WebSocketServer({ server });
const port = 8000;
const clients = {};
const users = {};
const userActivity = [];

server.listen(port, () => {
  console.log(`WebSocket server is running on port ${port}`);
});

wsServer.on('connection', function(connection) {
  const userId = uuidv4();
  console.log(`Received a new connection.`);

  clients[userId] = connection;
  console.log(`${userId} connected.`);

  connection.on('close', () => handleDisconnect(userId));
});

function broadcastMessage(json) {
  const data = JSON.stringify(json);
  for (let userId in clients) {
    let client = clients[userId];
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  }
}

function handleDisconnect(userId) {
  console.log(`${userId} disconnected.`);
  const json = { type: "USER_EVENT" };
  const username = users[userId]?.username || userId;
  userActivity.push(`${username} left the document`);
  json.data = { users, userActivity };
  delete clients[userId];
  delete users[userId];
  broadcastMessage(json);
}
