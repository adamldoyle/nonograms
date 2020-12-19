export default function generateRandomGrid(size) {
  const rows = [];
  for (let rowIdx = 0; rowIdx < size; rowIdx++) {
    const row = [];
    for (let colIdx = 0; colIdx < size; colIdx++) {
      let chance = 4;
      if (rowIdx > 0 && rows[rowIdx - 1][colIdx]) {
        chance += 2;
      } else if (colIdx > 0 && row[colIdx - 1]) {
        chance += 2;
      }
      row.push(
        Math.floor(Math.random() * 10) < chance ? { color: '#229922' } : null,
      );
    }
    rows.push(row);
  }
  return rows;
}
