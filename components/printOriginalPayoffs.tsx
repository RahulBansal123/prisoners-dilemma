import { useEffect, useState } from 'react';

const AMOUNT = 20;

export const PrintOriginalPayoffs = ({
  payoffMatrix,
  round,
  playerId,
}: {
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
      const res = await fetch('/api/getMoves');
      const data = await res.json();
      setMoves(data.moves);
    };

    const interval = setInterval(() => {
      fetchMoves();
    }, 1000);

    setTimeout(() => {
      clearInterval(interval);
    }, 20000);

    fetchMoves();

    return () => clearInterval(interval);
  }, []);

  const calculatePayOff = (player1Choice: string, player2Choice: string) => {
    const p1Index = player1Choice === 'cooperate' ? 0 : 1;
    const p2Index = player2Choice === 'cooperate' ? 0 : 1;

    let amount = 0;

    if (playerId === 1) {
      amount = payoffMatrix[p1Index][p2Index][0] * AMOUNT;
    } else {
      amount = payoffMatrix[p1Index][p2Index][1] * AMOUNT;
    }

    return `(${payoffMatrix[p1Index][p2Index][0]}, ${payoffMatrix[p1Index][p2Index][1]}) My reward value: Rs. ${amount}`;
  };

  const checkIfAllPlayersHaveMoved = () => {
    return (
      moves.length === 2 && moves.every((move) => move.history.length === round)
    );
  };

  if (!checkIfAllPlayersHaveMoved()) return null;

  return (
    <div className="flex justify-center space-x-2">
      <p className="text-center my-2 text-xl font-bold">
        Original Payoff Values for Round {round}:
        {calculatePayOff(
          moves.find((move) => move.playerId === 1)!.history[round - 1],
          moves.find((move) => move.playerId === 2)!.history[round - 1]
        )}
      </p>
    </div>
  );
};
