// Servidor de señalización WebSocket muy simple.
// Uso: npm init -y && npm install ws
// Luego: node signaling-server.js
//
// Atención: este servidor NO es production-ready — solo demo.
// Para producción añade autenticación, control de errores, TLS/WSS, y límites de memoria.

const WebSocket = require('ws');
const port = process.env.PORT || 3000;
const wss = new WebSocket.Server({ port });

console.log('Signaling server listening on port', port);

const rooms = new Map(); // room -> Set of sockets

wss.on('connection', (ws) => {
  ws.on('message', (msg) => {
    let data;
    try { data = JSON.parse(msg); } catch (e) { return; }

    if (data.action === 'join' && data.room) {
      const room = data.room;
      ws.room = room;
      if (!rooms.has(room)) rooms.set(room, new Set());
      rooms.get(room).add(ws);
      const clients = rooms.get(room).size;
      // informar al cliente sobre cuantos hay
      ws.send(JSON.stringify({ action: 'joined', room, clients }));
      console.log('Client joined room', room, 'clients=', clients);
      return;
    }

    if (data.action === 'signal' && data.room && data.data) {
      // reenviar a los demás en la sala
      const set = rooms.get(data.room);
      if (!set) return;
      for (const client of set) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ action: 'signal', room: data.room, data: data.data }));
        }
      }
    }

    if (data.action === 'leave' && data.room) {
      leaveRoom(ws, data.room);
    }
  });

  ws.on('close', () => {
    if (ws.room) leaveRoom(ws, ws.room);
  });
});

function leaveRoom(ws, room) {
  const set = rooms.get(room);
  if (!set) return;
  set.delete(ws);
  if (set.size === 0) rooms.delete(room);
  else {
    // avisar a los restantes del cambio de clientes
    for (const client of set) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ action: 'joined', room, clients: set.size }));
      }
    }
  }
  console.log('Client left room', room);
}
