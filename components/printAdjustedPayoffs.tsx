import { useEffect, useState } from 'react';

const AMOUNT = 20;

export const PrintAdjustedPayoffs = ({
  originalPayoffMatrix,
  payoffMatrix,
  round,
  playerId,
}: {
  originalPayoffMatrix: number[][][];
  payoffMatrix: number[][][];
  round: number;
  playerId: number;
}) => {
  const [moves, setMoves] = useState<
    {
      playerId: number;
      history: string[];
    }[]
  >([]);

  useEffect(() => {
    const fetchMoves = async () => {
      const res = await fetch(`/api/getMoves`);
      const data = await res.json();
      setMoves(data.moves);
    };

    fetchMoves();
  }, []);

  const calculatePayOff = (player1Choice: string, player2Choice: string) => {
    const p1Index = player1Choice === 'cooperate' ? 0 : 1;
    const p2Index = player2Choice === 'cooperate' ? 0 : 1;

    let olAmount = 0;
    let newAmount = 0;

    if (playerId === 1) {
      olAmount = originalPayoffMatrix[p1Index][p2Index][0] * AMOUNT;
      newAmount = payoffMatrix[p1Index][p2Index][0] * AMOUNT;
    } else {
      olAmount = originalPayoffMatrix[p1Index][p2Index][1] * AMOUNT;
      newAmount = payoffMatrix[p1Index][p2Index][1] * AMOUNT;
    }

    return `Round: ${round}, Old reward: Rs. ${olAmount}, New reward: Rs. ${newAmount}`;
  };

  if (moves.length === 0) {
    return null;
  }

  return (
    <div className="flex justify-center space-x-2">
      <p className="text-center my-2 text-xl font-bold">
        If you have chosen the same move as with the original payoff matrix,
        your payoffs with the adjusted payoff matrix will be:
        <br />
        {calculatePayOff(
          moves.find((move) => move.playerId === 1)!.history[round - 1],
          moves.find((move) => move.playerId === 2)!.history[round - 1]
        )}
      </p>
    </div>
  );
};
