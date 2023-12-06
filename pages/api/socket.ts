import { sql } from '@vercel/postgres';
import { Server } from 'socket.io';

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket is already running');
  } else {
    const io = new Server(res.socket.server);

    res.socket.server.io = io;
    io.on('connection', (socket) => {
      socket.on('join-game', async (username: string) => {
        const { rows: players } =
          await sql`SELECT COUNT(playerid) AS total_players FROM Game`;

        const { total_players } = players[0];

        const playerId = Number(total_players) + 1;

        await sql`INSERT INTO Game (playerid, username, history, spf, tp, ff) VALUES (${playerId}, ${username}, '{}', ${0}, ${0}, ${0})`;

        socket.emit('joined-game', { playerId, username });
        socket.emit('player-turn', 1);
        socket.broadcast.emit('player-turn', 1);
      });

      socket.on('play-move', async (data) => {
        console.log('play-move', data);
        const { playerId, move } = data;

        await sql`UPDATE Game SET history = array_append(history, ${move}) WHERE playerid = ${playerId}`;

        socket.broadcast.emit('opponent-move', data);
      });

      socket.on('enter-values', async (data) => {
        const { playerId, SPF, TP, FF } = data;

        await sql`UPDATE Game
              SET spf = ${SPF}, tp = ${TP}, ff = ${FF}
              WHERE playerid = ${playerId}`;

        socket.broadcast.emit('opponent-values', data);
      });
    });
  }
  res.end();
};

export default SocketHandler;
