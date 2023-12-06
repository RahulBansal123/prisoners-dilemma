import { findNashEquilibria } from '@/lib';
import { useEffect, useState } from 'react';

export const PlayerHistoryAdjacent = ({
  adjacentMatrix,
}: {
  adjacentMatrix: [number, number][][];
}) => {
  const [player1History, setPlayer1History] = useState<string[]>([]);
  const [player2History, setPlayer2History] = useState<string[]>([]);

  const calculateHistory = () => {
    const last_round_payoffs = findNashEquilibria(adjacentMatrix);

    let player1_history: string[] = [];
    let player2_history: string[] = [];

    if (last_round_payoffs[0][0] === 0) {
      player1_history.push('C');
    }
    if (last_round_payoffs[0][0] === 1) {
      player1_history.push('D');
    }
    if (last_round_payoffs[0][1] === 0) {
      player2_history.push('C');
    }
    if (last_round_payoffs[0][1] === 1) {
      player2_history.push('D');
    }

    let pay1_c: [number, number][] = adjacentMatrix[0];
    let pay2_d: [number, number][] = adjacentMatrix[1];
    let a: number = Math.max(pay1_c[0][0], pay1_c[1][0]);
    let b: number = Math.max(pay2_d[0][0], pay2_d[1][0]);

    if (a > b) {
      player1_history.unshift('C');
    } else {
      player1_history.unshift('D');
    }

    if (player1_history[0] === 'C') {
      let e: number = pay1_c[0][1];
      let f: number = pay1_c[1][1];
      if (e > f) player2_history.unshift('C');
      else player2_history.unshift('D');
    } else {
      let e: number = pay2_d[0][1];
      let f: number = pay2_d[1][1];
      if (e > f) player2_history.unshift('C');
      else player2_history.unshift('D');
    }

    console.log('2', player1_history, player2_history);

    setPlayer1History(player1_history);
    setPlayer2History(player2_history);
  };

  useEffect(() => {
    calculateHistory();
  }, []);

  const printHistory = (move: string) => {
    if (move === 'C') {
      return 'Cooperate';
    }
    if (move === 'D') {
      return 'Defect';
    }
  };

  return (
    <div className="mt-14 w-full flex flex-col">
      <p className="text-center my-2 text-2xl font-bold">
        Adjusted payoff matrix sub perfect nash equilibrium
      </p>

      <div className="mx-auto flex flex-col space-y-4">
        {player1History.map((move, index) => (
          <div
            key={index}
            className="p-1 border border-black flex items-center justify-center"
          >
            <p className="mr-4 text-center font-bold">Stage {index + 1}:</p>
            {printHistory(player1History[index])} ,{' '}
            {printHistory(player2History[index])}
          </div>
        ))}
      </div>
    </div>
  );
};
