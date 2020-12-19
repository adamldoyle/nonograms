export default function GridPreview({ data, color, cellSize, onClick }) {
  return (
    <table
      cellPadding={0}
      cellSpacing={0}
      style={{ border: '1px solid black' }}
    >
      <tbody>
        {data.map((row, rowIdx) => {
          return (
            <tr key={rowIdx}>
              {row.map((col, colIdx) => (
                <td
                  key={colIdx}
                  onClick={onClick ? () => onClick(rowIdx, colIdx) : null}
                  style={{
                    backgroundColor: col.cellMode === 1 ? color : null,
                    width: cellSize,
                    height: cellSize,
                  }}
                ></td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
