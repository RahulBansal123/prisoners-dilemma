import { sql } from '@vercel/postgres';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { rows: players } =
    await sql`SELECT COUNT(playerId) AS total_players FROM Game`;

  const { total_players: totalPlayers } = players[0];

  const { rows: game } = await sql`SELECT * FROM Game;`;

  const moves = [];
  for (let i = 0; i < totalPlayers; i++) {
    const player = game[i];
    moves.push({
      playerId: player.playerid,
      history: player.history,
    });
  }
  res.status(200).json({ moves });
}
