import { Matrix } from '@/components/adjusted';
import { PlayGame } from '@/components/game';
import { JoinGame } from '@/components/joinGame';
import { OriginalMatrix } from '@/components/originalMatrix';
import { PlayerHistory } from '@/components/playerHistory';
import { PlayerHistoryAdjacent } from '@/components/playerHistoryAdj';
import { PrintAdjustedPayoffs } from '@/components/printAdjustedPayoffs';
import { PrintFactorMatrix } from '@/components/printFactorMatrix';
import { PrintOriginalPayoffs } from '@/components/printOriginalPayoffs';
import { useEffect, useState } from 'react';

import { io } from 'socket.io-client';

const payoffMatrix: [number, number][][] = [
  [
    [4.0, 4.0],
    [1.0, 6.0],
  ],
  [
    [6.0, 1.0],
    [3.0, 3.0],
  ],
];

export default function Home() {
  const [currentRound, setCurrentRound] = useState(1);
  const [step, setStep] = useState(0);
  const [socket, setSocket] = useState<any>(null);
  const [playerId, setPlayerId] = useState<number | null>(null);
  const [turn, setTurn] = useState<number>(0);

  const [opponentMove, setOpponentMove] = useState<{
    playerId: number;
    move: 'cooperate' | 'defect';
  } | null>(null);

  const [adjacentMatrix, setAdjacentMatrix] = useState<[number, number][][]>(
    []
  );

  const socketInitializer = async () => {
    await fetch('/api/reset');
    await fetch('/api/socket');

    const socket = io();

    socket.on('connect', () => {
      console.log('connected');
    });

    socket.on('joined-game', (data) => {
      console.log('joined-game', data);
      setPlayerId(data.playerId);
      setStep(1);
    });

    socket.on('player-turn', (playerId) => {
      console.log('player-turn', playerId);
      setTurn(playerId);
    });

    socket.on('opponent-move', (data: any) => {
      console.log('opponent-move', data);
      setOpponentMove(data);
      setTurn(data.playerId === 1 ? 2 : 1);
    });

    socket.on('disconnect', () => {
      console.log('disconnected');
    });

    setSocket(socket);
  };

  useEffect(() => {
    socketInitializer();
    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  if (!socket) {
    return <div>Loading...</div>;
  }

  return (
    <main
      className={`w-1/2 mx-auto flex min-h-screen flex-col items-center justify-between p-14`}
    >
      <h4 className="text-5xl font-bold">Prisoner's Dilemma</h4>
      <p className="my-4 text-center text-base">
        The prisoner's dilemma is a well-known parable for the difficulty of
        solving collective action problems. By acting in their own
        self-interests, the metaphorical prisoners find themselves with a
        greater penalty than they would face if they had worked together.
      </p>
      <img src="/img.png" alt="Prisoner's Dilemma" />

      {/* Join Game */}
      {step === 0 && <JoinGame socket={socket} />}

      {/* Original Matrix */}
      {step >= 1 && <OriginalMatrix />}

      {step >= 1 && (
        <div className="w-full">
          {/* Round 1 */}
          {currentRound === 1 && (
            <div className="w-full flex flex-col space-y-4">
              <p className="text-center text-2xl font-bold">Round 1</p>
              <PlayGame
                onComplete={() => setCurrentRound(2)}
                turn={turn}
                playerId={playerId as number}
                socket={socket}
                opponentMove={opponentMove}
              />
            </div>
          )}

          {currentRound >= 2 && (
            <PrintOriginalPayoffs
              payoffMatrix={payoffMatrix}
              round={1}
              playerId={playerId as number}
            />
          )}

          {/* Round 2 */}
          {currentRound === 2 && (
            <div className="mt-10 w-full flex flex-col space-y-4">
              <p className="text-center text-2xl font-bold">Round 2</p>
              <PlayGame
                onComplete={() => {
                  setStep(2);
                  setCurrentRound(3);
                }}
                turn={turn}
                playerId={playerId as number}
                socket={socket}
                opponentMove={opponentMove}
              />
            </div>
          )}

          {currentRound === 3 && (
            <PrintOriginalPayoffs
              payoffMatrix={payoffMatrix}
              round={2}
              playerId={playerId as number}
            />
          )}
        </div>
      )}

      {step >= 2 && (
        <PlayerHistory
          payoffMatrix={payoffMatrix}
          goToNextStep={() => setStep(3)}
        />
      )}

      {step === 3 && (
        <Matrix
          socket={socket}
          playerId={playerId as number}
          goToNextStep={() => setStep(4)}
        />
      )}

      {step >= 4 && (
        <PrintFactorMatrix
          matrix={adjacentMatrix}
          setMatrix={setAdjacentMatrix}
          goToNextStep={() => setStep(5)}
        />
      )}

      {step === 5 && <PlayerHistoryAdjacent adjacentMatrix={adjacentMatrix} />}

      {step >= 5 && (
        <div className="mt-20 w-full">
          <PrintAdjustedPayoffs
            originalPayoffMatrix={payoffMatrix}
            payoffMatrix={adjacentMatrix}
            round={1}
            playerId={playerId as number}
          />

          <PrintAdjustedPayoffs
            originalPayoffMatrix={payoffMatrix}
            payoffMatrix={adjacentMatrix}
            round={2}
            playerId={playerId as number}
          />
        </div>
      )}
    </main>
  );
}
