import {
  Fragment,
  useState,
  useEffect,
  useContext,
  memo,
  useMemo,
} from 'react';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import ClickModeContext, { ClickMode } from '../../context/ClickModeContext';
import GridMouseContext from '../../context/GridMouseContext';
import useLocalStorage from '../../hooks/useLocalStorage';

const useCellStyles = makeStyles({
  cell: ({ rowIdx, colIdx, solved, gridWidth, gridHeight }) => {
    const thinBorder = '1px solid #777777';
    const thickBorder = '2px solid #777777';

    let borderTop = null;
    let borderRight = solved ? null : thinBorder;
    let borderBottom = solved ? null : thinBorder;
    let borderLeft = null;

    if (colIdx === 0) {
      borderLeft = thickBorder;
    }
    if (colIdx === gridWidth - 1) {
      borderRight = thickBorder;
    } else if ((colIdx + 1) % 5 === 0) {
      borderRight = solved ? null : thickBorder;
    }
    if (rowIdx === 0) {
      borderTop = thickBorder;
    }
    if (rowIdx === gridHeight - 1) {
      borderBottom = thickBorder;
    } else if ((rowIdx + 1) % 5 === 0) {
      borderBottom = solved ? null : thickBorder;
    }
    return {
      borderTop,
      borderRight,
      borderBottom,
      borderLeft,
      verticalAlign: 'bottom',
    };
  },
  cellFill: ({ cellDimension }) => {
    return {
      position: 'relative',
      width: cellDimension,
      height: cellDimension,
    };
  },
  cellClick: ({ cellDimension }) => ({
    position: 'absolute',
    top: 2,
    left: 2,
    width: cellDimension - 4,
    height: cellDimension - 4,
    touchAction: 'none',
  }),
  xIcon: {
    width: '100%',
    height: '100%',
  },
});

const useGridStyles = makeStyles({
  grid: {
    padding: 20,
  },
  topHeaderCell: {
    verticalAlign: 'bottom',
    textAlign: 'center',
    lineHeight: 1.2,
    paddingBottom: 3,
    userSelect: 'none',
  },
  leftHeaderCell: {
    textAlign: 'right',
    letterSpacing: '1px',
    paddingRight: 4,
    userSelect: 'none',
    whiteSpace: 'nowrap',
  },
  modeButton: {
    width: 100,
    height: 20,
    marginBottom: 5,
    marginRight: 5,
  },
  underline: {
    textDecoration: 'underline',
  },
});

const getNumbers = (rowIdx, colIdx, solution) => {
  const numbers = [];
  let tally = 0;
  const solutionLength = rowIdx === -1 ? solution.length : solution[0].length;
  for (let i = 0; i < solutionLength; i++) {
    if (solution[rowIdx === -1 ? i : rowIdx][colIdx === -1 ? i : colIdx]) {
      tally++;
    } else if (tally > 0) {
      numbers.push(tally);
      tally = 0;
    }
  }
  if (tally > 0 || numbers.length === 0) {
    numbers.push(tally);
  }
  return numbers;
};

const getAllNumbers = (solution) => {
  return {
    rows: solution.map((row, rowIdx) => getNumbers(rowIdx, -1, solution)),
    cols: solution[0].map((cellSolution, colIdx) =>
      getNumbers(-1, colIdx, solution),
    ),
  };
};

const CellMode = {
  Off: 0,
  On: 1,
  X: 2,
};

const Cell = memo(
  ({
    rowIdx,
    colIdx,
    solution,
    clickMode,
    cellDimension,
    dispatch,
    solved,
    initialCellData,
    hideErrors,
  }) => {
    const { coordinates, onMouseDown, onMouseUp } = useContext(
      GridMouseContext,
    );

    const shouldBeOn = solution[rowIdx][colIdx];
    const [cellMode, setCellMode] = useState(initialCellData.cellMode);
    const [error, setError] = useState(initialCellData.error);

    const classes = useCellStyles({
      rowIdx,
      colIdx,
      gridWidth: solution[0].length,
      gridHeight: solution.length,
      cellDimension,
      cellMode,
      error,
      solved,
      solutionColor: solution[rowIdx][colIdx]?.color ?? '#229922',
    });

    const adjustCell = () => {
      if (solved) {
        return;
      }

      let newCellMode = cellMode;
      let newError = error;
      switch (clickMode) {
        case ClickMode.Pencil:
          if (coordinates.current === null || cellMode === CellMode.Off) {
            newCellMode = CellMode.On;
            newError = !shouldBeOn;
          }
          break;
        case ClickMode.X:
          if (coordinates.current === null || cellMode === CellMode.Off) {
            newCellMode = CellMode.X;
            newError = shouldBeOn;
          }
          break;
        case ClickMode.Eraser:
          newCellMode = CellMode.Off;
          newError = false;
          break;
        default:
          break;
      }
      setCellMode(newCellMode);
      setError(newError);
      dispatch({
        type: 'cell:toggle',
        payload: {
          rowIdx,
          colIdx,
          cellMode: newCellMode,
          error: newError,
        },
      });
    };

    const handleClick = (event) => {
      event.preventDefault();
      adjustCell();
    };

    const handleMouseDown = (event) => {
      event.preventDefault();
      adjustCell();
      onMouseDown(rowIdx, colIdx);
    };

    const handleMouseUp = (event) => {
      event.preventDefault();
      onMouseUp(rowIdx, colIdx);
    };

    const handleMouseOver = (event) => {
      event.preventDefault();
      if (
        coordinates.current &&
        (rowIdx === coordinates.current.rowIdx ||
          colIdx === coordinates.current.colIdx)
      ) {
        adjustCell();
      }
    };

    let backgroundColor = null;
    let color = null;
    if (error && !hideErrors) {
      backgroundColor = '#cc0000';
    } else if (!error && solved && cellMode === CellMode.On) {
      backgroundColor = solution[rowIdx][colIdx]?.color ?? '#229922';
    } else if (cellMode === CellMode.On) {
      backgroundColor = '#444444';
    }
    if (cellMode === CellMode.X) {
      color = '#444444';
    }

    return (
      <td className={classes.cell} style={{ backgroundColor, color }}>
        <div className={classes.cellFill}>
          {cellMode === CellMode.X && !solved && (
            <CloseIcon className={classes.xIcon} />
          )}
          <div
            className={classes.cellClick}
            onClick={handleClick}
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchEnd={handleMouseUp}
            onMouseOver={handleMouseOver}
          />
        </div>
      </td>
    );
  },
);

export default memo(function Grid({
  solution,
  dispatch,
  solved,
  initialCellData,
}) {
  const { mode, setMode } = useContext(ClickModeContext);
  const [hideErrors, setHideErrors] = useLocalStorage(false);

  const [cellDimension, setCellDimension] = useState(20);

  const headerNumbers = useMemo(() => getAllNumbers(solution), [solution]);

  useEffect(() => {
    const handleResize = () => {
      const widthSize = window.innerWidth / (solution[0].length * 1.5);
      const heightSize = window.innerHeight / (solution.length * 1.5);
      setCellDimension(
        Math.max(20, Math.floor(Math.min(widthSize, heightSize))),
      );
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [solution]);

  const classes = useGridStyles();

  const handleMouseOver = (evt) => {
    evt.preventDefault();
    let currentElementTouched = document.elementFromPoint(
      evt.touches[0].pageX,
      evt.touches[0].pageY,
    );
    while (currentElementTouched && !currentElementTouched.click) {
      currentElementTouched = currentElementTouched.parentElement;
    }
    if (currentElementTouched) {
      currentElementTouched.click();
    }
  };

  return (
    <table cellPadding={0} cellSpacing={0} className={classes.grid}>
      <tbody onTouchMove={handleMouseOver}>
        <tr>
          <td style={{ verticalAlign: 'bottom' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
              }}
            >
              {!solved && (
                <>
                  <Button
                    className={classes.modeButton}
                    variant="contained"
                    color={mode === ClickMode.Pencil ? 'primary' : 'default'}
                    onClick={() => setMode(ClickMode.Pencil)}
                  >
                    <span className={classes.underline}>P</span>encil
                  </Button>
                  <Button
                    className={classes.modeButton}
                    variant="contained"
                    color={mode === ClickMode.X ? 'primary' : 'default'}
                    onClick={() => setMode(ClickMode.X)}
                  >
                    <span className={classes.underline}>X</span>
                  </Button>
                  <Button
                    className={classes.modeButton}
                    variant="contained"
                    color={mode === ClickMode.Eraser ? 'primary' : 'default'}
                    onClick={() => setMode(ClickMode.Eraser)}
                  >
                    <span className={classes.underline}>E</span>raser
                  </Button>
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        checked={hideErrors}
                        onChange={() => setHideErrors(!hideErrors)}
                      />
                    }
                    label="Hide errors"
                    labelPlacement="start"
                  />
                </>
              )}
            </div>
          </td>
          {solution[0].map((col, colIdx) => (
            <td key={colIdx} className={classes.topHeaderCell}>
              {headerNumbers.cols[colIdx].map((num, numIdx) => (
                <Fragment key={numIdx}>
                  {num}
                  <br />
                </Fragment>
              ))}
            </td>
          ))}
        </tr>
        {solution.map((row, rowIdx) => {
          return (
            <tr key={rowIdx}>
              <td className={classes.leftHeaderCell}>
                {headerNumbers.rows[rowIdx].join(' ')}
              </td>
              {row.map((col, colIdx) => (
                <Cell
                  key={colIdx}
                  rowIdx={rowIdx}
                  colIdx={colIdx}
                  solution={solution}
                  clickMode={mode}
                  cellDimension={cellDimension}
                  dispatch={dispatch}
                  solved={solved}
                  initialCellData={initialCellData[rowIdx][colIdx]}
                  hideErrors={hideErrors}
                />
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
});
