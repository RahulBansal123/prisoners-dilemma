import { useState } from 'react';
import { LabelInput } from './label-input';

export const Matrix = ({
  socket,
  playerId,
  goToNextStep,
}: {
  socket: any;
  playerId: number;
  goToNextStep: () => void;
}) => {
  const [SPF, setSocialPreferenceFactor] = useState<number>(0);
  const [TP, setTemptationPayoffFactor] = useState<number>(0);
  const [FF, setFF] = useState<number>(0);

  const handleSubmit = () => {
    socket.emit('enter-values', {
      playerId,
      SPF,
      TP,
      FF,
    });

    goToNextStep();
  };

  return (
    <div className="mt-14 w-full">
      <div className={`space-y-4 flex flex-col`}>
        <h3 className="text-center text-2xl font-bold">
          Adjusted Payoff Matrix
        </h3>
        <p className="text-center text-lg font-bold">
          Enter values for the following factors
        </p>
        <LabelInput
          id="socialPreferenceFactor"
          label="Enter Social Preference Factor (0-1):"
          placeholder="Enter value"
          value={SPF}
          onChange={(e) => setSocialPreferenceFactor(e.target.value)}
        />
        <LabelInput
          id="temptationPayoffFactor"
          label="Enter Temptation Payoff Factor(1-5) :"
          placeholder="Enter value"
          value={TP}
          onChange={(e) => {
            setTemptationPayoffFactor(Number(e.target.value));
          }}
        />

        <LabelInput
          id="forgivenessFactor"
          label="Enter Forgiveness factor (0-1):"
          placeholder="Enter value"
          value={FF}
          onChange={(e) => {
            setFF(e.target.value);
          }}
        />

        <button
          className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded disabled:cursor-not-allowed"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};
