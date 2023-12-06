export const OriginalMatrix = () => {
  return (
    <div className="w-full my-10">
      <p className="text-center my-2 text-2xl font-bold">
        Original Payoff Matrix:
      </p>
      <table className="w-full">
        <thead>
          <tr>
            <th className="border border-black px-4 py-2"></th>
            <th className="border border-black px-4 py-2">Cooperate</th>
            <th className="border border-black px-4 py-2">Defect</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-black px-4 py-2">Cooperate</td>
            <td className="border border-black px-4 py-2">4.0, 4.0</td>
            <td className="border border-black px-4 py-2">1.0, 6.0</td>
          </tr>
          <tr>
            <td className="border border-black px-4 py-2">Defect</td>
            <td className="border border-black px-4 py-2">6.0, 1.0</td>
            <td className="border border-black px-4 py-2">3.0, 3.0</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
