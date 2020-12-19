import { useMemo, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import useLocalStorage from '../../hooks/useLocalStorage';
import Grid from '../Grid';

export default function Game() {
  const { id } = useParams();

  const [game, setGame] = useLocalStorage(`existing-games-${id}`);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialCellData = useMemo(() => game.cellData, []);

  const [state, dispatch] = useReducer((state, action) => {
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
              (game.grid[rowIdx][colIdx] && cell.cellMode !== 1) || cell.error,
          ),
        );
        setGame({
          ...game,
          cellData: newCellData,
          solved: remaining === undefined,
          updated: new Date(),
        });
        return {
          ...state,
          cellData: newCellData,
          solved: remaining === undefined,
        };
      default:
        return state;
    }
  }, game);

  return (
    <>
      <Grid
        solution={game.grid}
        dispatch={dispatch}
        solved={state.solved}
        initialCellData={initialCellData}
      />
    </>
  );
}
