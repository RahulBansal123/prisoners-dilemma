import { findNashEquilibria } from '@/lib';
import { useEffect, useState } from 'react';

export const PlayerHistory = ({
  payoffMatrix,
  goToNextStep,
}: {
  payoffMatrix: [number, number][][];
  goToNextStep: () => void;
}) => {
  const [player1History, setPlayer1History] = useState<string[]>([]);
  const [player2History, setPlayer2History] = useState<string[]>([]);

  const calculateHistory = () => {
    const last_round_payoffs = findNashEquilibria(payoffMatrix);

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

    for (let i = 0; i < 1; i++) {
      // ROUND 2
      if (player2_history[0] === 'D') {
        player1_history.unshift('D');
      }
      if (player2_history[0] === 'C') {
        player1_history.unshift('D');
      }
      if (player1_history[0] === 'D') {
        player2_history.unshift('D');
      }
      if (player1_history[0] === 'C') {
        player2_history.unshift('D');
      }
    }

    setPlayer1History(player1_history);
    setPlayer2History(player2_history);

    goToNextStep();
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
        Sub-perfect nash equilibrium in each stage:
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
