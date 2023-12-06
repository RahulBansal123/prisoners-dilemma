import type { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await sql`DELETE FROM Game`;
  res.status(200).json({ ok: true });
}
