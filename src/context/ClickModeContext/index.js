import { createContext, useState, useEffect } from 'react';

export const ClickMode = {
  Pencil: 0,
  X: 1,
  Eraser: 2,
};

export const ClickModeName = (clickMode) => {
  switch (clickMode) {
    case 0:
      return 'Pencil';
    case 1:
      return 'X';
    case 2:
      return 'Eraser';
    default:
      return 'Unknown';
  }
};

const ClickModeContext = createContext({
  mode: ClickMode.Pencil,
  setMode: () => null,
});

export function ClickModeContextProvider({ children }) {
  const [clickMode, setClickMode] = useState(ClickMode.Pencil);

  const onKeyDown = (evt) => {
    switch (evt.key.toLowerCase()) {
      case 'p':
        setClickMode(ClickMode.Pencil);
        break;
      case 'x':
        setClickMode(ClickMode.X);
        break;
      case 'e':
        setClickMode(ClickMode.Eraser);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  });

  return (
    <ClickModeContext.Provider
      value={{ mode: clickMode, setMode: setClickMode }}
    >
      {children}
    </ClickModeContext.Provider>
  );
}

export default ClickModeContext;
