import { useState, useReducer } from 'react';
import Grid from '../Grid';

export default function Game({ size }) {
  // const patternString = `
  // ooxo
  // oxoo
  // xoox
  // oxxo
  // `;

  // const pattern = patternString
  //   .split('\n')
  //   .map((line) => line.trim())
  //   .filter((line) => line)
  //   .map((line) => line.split('').map((item) => item === 'x'));

  const [solution] = useState(() => {
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
        row.push(Math.floor(Math.random() * 10) < chance ? { color: '#229922' } : null);
      }
      rows.push(row);
    }
    return rows;
  });

  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case 'cell:toggle':
          const oldCellData = state.cellData;
          const newCell = action.payload;
          const newCellData = [
            ...oldCellData.slice(0, newCell.rowIdx),
            [
              ...oldCellData[newCell.rowIdx].slice(0, newCell.colIdx),
              newCell,
              ...oldCellData[action.payload.rowIdx].slice(newCell.colIdx + 1),
            ],
            ...oldCellData.slice(newCell.rowIdx + 1),
          ];
          const remaining = newCellData.find((row, rowIdx) =>
            row.find(
              (cell, colIdx) =>
                (solution[rowIdx][colIdx] && cell.cellMode !== 1) || cell.error,
            ),
          );
          return {
            ...state,
            cellData: newCellData,
            solved: remaining === undefined,
          };
        default:
          return state;
      }
    },
    size,
    (size) => ({
      cellData: [...Array(size).keys()].map((row, rowIdx) =>
        [...Array(size).keys()].map((col, colIdx) => ({
          rowIdx,
          colIdx,
          cellMode: 0,
          error: false,
        })),
      ),
      solved: false,
    }),
  );

  return (
    <>
      <Grid solution={solution} dispatch={dispatch} solved={state.solved} />
    </>
  );
}
