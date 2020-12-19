import { useState, useEffect, useReducer } from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '../Grid';

const buildEmptyArrays = (size, generateContents) =>
  [...Array(size).keys()].map((row, rowIdx) =>
    [...Array(size).keys()].map((col, colIdx) =>
      generateContents(rowIdx, colIdx),
    ),
  );

const buildEmptyCellData = (size) =>
  buildEmptyArrays(size, (rowIdx, colIdx) => ({
    rowIdx,
    colIdx,
    cellMode: 0,
    error: false,
  }));

const buildEmptySolution = (size) => buildEmptyArrays(size, () => null);

export default function GridBuilder() {
  const [sizeValue, setSizeValue] = useState('15');
  const size = parseInt(sizeValue);

  const updateSize = (evt) => {
    setSizeValue(evt.target.value);
  };

  useEffect(() => {
    if (!size) {
      return;
    }

    dispatch({ type: 'grid:size', payload: { size } });
  }, [size]);

  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case 'grid:size':
          return {
            ...state,
            cellData: buildEmptyCellData(action.payload.size),
          };
        case 'cell:toggle':
          const oldSolution = state.solution;
          const newCell = action.payload;
          const newSolution = [
            ...oldSolution.slice(0, newCell.rowIdx),
            [
              ...oldSolution[newCell.rowIdx].slice(0, newCell.colIdx),
              newCell.cellMode === 1 ? {} : null,
              ...oldSolution[action.payload.rowIdx].slice(newCell.colIdx + 1),
            ],
            ...oldSolution.slice(newCell.rowIdx + 1),
          ];
          return {
            ...state,
            solution: newSolution,
          };
        default:
          return state;
      }
    },
    size,
    () => ({
      cellData: buildEmptyCellData(size),
      solution: buildEmptySolution(size),
    }),
  );

  return (
    <>
      <TextField value={sizeValue} onChange={updateSize} />
      {state.cellData.length && (
        <Grid
          key={sizeValue}
          solution={state.cellData}
          dispatch={dispatch}
          solved={false}
          initialCellData={state.cellData}
        />
      )}
      <code>
        <pre>
          {state.solution.map(
            (row) => row.map((col) => (col ? 'x' : 'o')).join('') + '\n',
          )}
        </pre>
      </code>
    </>
  );
}
