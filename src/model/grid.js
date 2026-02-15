export const ROWS = 30;
export const COLS = 40;

export const createDefaultCell = () => ({
  type: 'empty',
  label: '',
  binId: null,
  depth: null,
  isHead: false,
  direction: null,
  zone: ''
});

export const createEmptyGrid = (rows = ROWS, cols = COLS) => (
  Array.from({ length: rows }, () => Array.from({ length: cols }, () => createDefaultCell()))
);

export const cloneGrid = (grid) => grid.map((row) => row.map((cell) => ({ ...cell })));

export const cellKey = (row, col, cols = COLS) => row * cols + col;
