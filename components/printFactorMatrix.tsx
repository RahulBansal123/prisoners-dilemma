import { useEffect, useState } from 'react';

export const PrintFactorMatrix = ({
  matrix,
  setMatrix,
  goToNextStep,
}: {
  matrix: [number, number][][];
  setMatrix: (matrix: [number, number][][]) => void;
  goToNextStep: () => void;
}) => {
  const [values, setValues] = useState<
    {
      SPF: number;
      TP: number;
      FF: number;
    }[]
  >([]);

  const calculatePayOff = () => {
    const SPF1 = values[0].SPF;
    const SPF2 = values[1].SPF;
    const TP1 = values[0].TP;
    const TP2 = values[1].TP;
    const FF1 = values[0].FF;
    const FF2 = values[1].FF;

    const adj_payoff_matrix: [number, number][][] = [
      [
        [4 + SPF1 * 4, 4 + SPF2 * 4],
        [1 - SPF1 * (1 - (4 + Number(TP1))), 4 + Number(TP2)],
      ],
      [
        [4 + Number(TP1), 1 - SPF2 * (1 - (4 + Number(TP2)))],
        [3 + FF1 * (3 - 1), 3 + FF2 * (3 - 1)],
      ],
    ];

    setMatrix(adj_payoff_matrix);
    goToNextStep();
  };

  useEffect(() => {
    const fetchValues = async () => {
      const res = await fetch('/api/getValues');
      const resJSON = await res.json();

      const data = resJSON.values;
      setValues(data);
    };

    const interval = setInterval(() => {
      fetchValues();
    }, 1000);

    setTimeout(() => {
      clearInterval(interval);
    }, 20000);

    fetchValues();

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (values.length === 2 && values.every((value) => value.TP !== 0)) {
      calculatePayOff();
    }
  }, [values]);

  if (matrix.length === 0) {
    return (
      <p className="mt-10 text-center text-lg font-bold">
        Wait for the other player to enter their values...
      </p>
    );
  }

  return (
    <div className="mt-10 w-full">
      <h3 className="text-center text-lg font-bold">Adjusted payoff matrix</h3>
      <table className="mt-2 w-full">
        <thead>
          <tr>
            <th className="border border-black px-4 py-2"></th>
            <th className="border border-black px-4 py-2">
              Player 2 Cooperate
            </th>
            <th className="border border-black px-4 py-2">Player 2 Defect</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-black px-4 py-2">
              Player 1 Cooperate
            </td>
            <td className="border border-black px-4 py-2">
              {JSON.stringify(matrix[0][0])}
            </td>
            <td className="border border-black px-4 py-2">
              {JSON.stringify(matrix[0][1])}
            </td>
          </tr>
          <tr>
            <td className="border border-black px-4 py-2">Player 1 Defect</td>
            <td className="border border-black px-4 py-2">
              {JSON.stringify(matrix[1][0])}
            </td>
            <td className="border border-black px-4 py-2">
              {JSON.stringify(matrix[1][1])}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
