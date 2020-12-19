import { createContext, useEffect, useRef } from 'react';

const GridMouseContext = createContext({
  coordinates: null,
  onMouseDown: (rowIdx, colIdx) => null,
  onMouseUp: (rowIdx, colIdx) => null,
});

export function GridMouseContextProvider({ children }) {
  // const [coordinates, setCoordinates] = useState(null);
  const coordinates = useRef(null);

  const setCoordinates = (coords) => {
    coordinates.current = coords;
  };

  const onMouseDown = (rowIdx, colIdx) => {
    setCoordinates({ rowIdx, colIdx });
  };

  const onMouseUp = (rowIdx, colIdx) => {
    setCoordinates(null);
  };

  const onGlobalMouseUp = () => {
    setCoordinates(null);
  };

  useEffect(() => {
    window.addEventListener('mouseup', onGlobalMouseUp);
    window.addEventListener('touchend', onGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', onGlobalMouseUp);
      window.removeEventListener('touchend', onGlobalMouseUp);
    };
  });

  return (
    <GridMouseContext.Provider
      value={{ coordinates: coordinates, onMouseDown, onMouseUp }}
    >
      {children}
    </GridMouseContext.Provider>
  );
}

export default GridMouseContext;
