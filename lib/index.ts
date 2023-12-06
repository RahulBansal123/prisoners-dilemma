export function findNashEquilibria(
  payoffMatrix: [number, number][][]
): [number, number][] {
  const nashEquilibria: [number, number][] = [];

  // Iterate through each cell in the matrix
  for (let i = 0; i < payoffMatrix.length; i++) {
    for (let j = 0; j < payoffMatrix[0].length; j++) {
      const cellValue = payoffMatrix[i][j];

      // Check if the cell is a Nash equilibrium
      const isNash: boolean =
        payoffMatrix.every(
          (row, rowIndex) => cellValue[0] >= payoffMatrix[rowIndex][j][0]
        ) &&
        payoffMatrix[0].every(
          (_col, colIndex) => cellValue[1] >= payoffMatrix[i][colIndex][1]
        );

      if (isNash) {
        nashEquilibria.push([i, j]);
      }
    }
  }

  return nashEquilibria;
}
