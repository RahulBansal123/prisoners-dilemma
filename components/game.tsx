import { useState } from 'react';
import { LabelInput } from './label-input';

export const PlayGame = ({
  turn,
  playerId,
  socket,
  opponentMove,
  onComplete,
}: {
  turn: number;
  playerId: number;
  socket: any;
  opponentMove: {
    playerId: number;
    move: 'cooperate' | 'defect';
  } | null;
  onComplete: () => void;
}) => {
  const [playerChoice, setPlayerChoice] = useState<'cooperate' | 'defect' | ''>(
    ''
  );

  const handleSubmission = () => {
    socket.emit('play-move', {
      playerId,
      move: playerChoice,
    });

    onComplete();
  };

  return (
    <div>
      <div className="mt-6 w-full flex flex-col space-y-4">
        <p className="text-center my-2 text-2xl font-bold">
          Turn: Player {turn}
        </p>

        {/* {opponentMove && opponentMove.playerId !== playerId && (
          <div className="flex flex-col space-y-4">
            <p className="text-center my-2 text-2xl font-bold">
              Opponent's Move: {opponentMove.move}
            </p>
          </div>
        )} */}

        {turn === playerId ? (
          <>
            <LabelInput
              id="choice"
              label="Enter choice (cooperate/defect)"
              placeholder="Enter value"
              value={playerChoice}
              onChange={(e) => {
                setPlayerChoice(e.target.value as 'cooperate' | 'defect');
              }}
            />
            <button
              className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded disabled:cursor-not-allowed"
              disabled={playerChoice?.length === 0}
              onClick={handleSubmission}
            >
              Play
            </button>
          </>
        ) : (
          <p className="text-center my-2 text-2xl font-bold">
            Waiting for opponent to play...
          </p>
        )}
      </div>
    </div>
  );
};
