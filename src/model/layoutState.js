import { COLS, ROWS, cloneGrid, createDefaultCell, createEmptyGrid } from './grid.js';

const deepClone = (value) => JSON.parse(JSON.stringify(value));

export function createLayoutState({ rows = ROWS, cols = COLS, gridData } = {}) {
  let state = {
    rows,
    cols,
    gridData: gridData ? cloneGrid(gridData) : createEmptyGrid(rows, cols),
    zones: { A: 'Zone A', B: 'Zone B', C: 'Zone C', D: 'Zone D' },
    history: [],
    future: []
  };
  const listeners = new Set();

  const notify = (op) => listeners.forEach((listener) => listener(getState(), op));
  const serialize = () => JSON.stringify({
    rows: state.rows,
    cols: state.cols,
    gridData: state.gridData,
    zones: state.zones
  });

  const pushHistory = () => {
    state.history.push(serialize());
    if (state.history.length > 150) state.history.shift();
    state.future = [];
  };

  const getCell = ({ row, col }) => state.gridData[row]?.[col];
  const setCell = ({ row, col }, patch) => {
    const cell = getCell({ row, col });
    if (!cell) return;
    state.gridData[row][col] = { ...cell, ...patch };
  };

  const deserialize = (payload, { trackHistory = true, notifyListeners = true } = {}) => {
    const data = typeof payload === 'string' ? JSON.parse(payload) : deepClone(payload);
    if (trackHistory) pushHistory();
    state.rows = data.rows ?? state.rows;
    state.cols = data.cols ?? state.cols;
    state.gridData = data.gridData ? cloneGrid(data.gridData) : createEmptyGrid(state.rows, state.cols);
    state.zones = { ...state.zones, ...(data.zones || {}) };
    if (notifyListeners) notify({ type: 'DESERIALIZE' });
    return getState();
  };

  const applyOperation = (op = {}) => {
    switch (op.type) {
      case 'SNAPSHOT':
        pushHistory();
        notify(op);
        return true;
      case 'SET_CELL':
        pushHistory();
        setCell(op.position, op.patch);
        notify(op);
        return true;
      case 'CLEAR_CELL':
        pushHistory();
        setCell(op.position, createDefaultCell());
        notify(op);
        return true;
      case 'BULK_PATCH_CELLS':
        pushHistory();
        (op.changes || []).forEach(({ position, patch }) => setCell(position, patch));
        notify(op);
        return true;
      case 'ASSIGN_BIN': {
        pushHistory();
        const { cells = [], binId, head, direction = null } = op;
        const headIndex = cells.findIndex((p) => p.row === head.row && p.col === head.col);
        if (headIndex < 0) return false;
        const ordered = headIndex > 0 ? cells.slice(headIndex).concat(cells.slice(0, headIndex)) : cells.slice();
        ordered.forEach((position, depth) => {
          setCell(position, {
            type: 'bin',
            binId,
            depth,
            isHead: depth === 0,
            direction,
            label: depth === 0 ? op.label ?? '' : ''
          });
        });
        notify(op);
        return true;
      }
      case 'SET_ZONE':
        pushHistory();
        (op.cells || []).forEach((position) => setCell(position, { zone: op.zone || '' }));
        notify(op);
        return true;
      case 'SET_ZONES_META':
        state.zones = { ...state.zones, ...(op.zones || {}) };
        notify(op);
        return true;
      case 'REPLACE_GRID':
        pushHistory();
        state.gridData = op.gridData ? cloneGrid(op.gridData) : createEmptyGrid(state.rows, state.cols);
        notify(op);
        return true;
      case 'UNDO': {
        if (!state.history.length) return false;
        state.future.push(serialize());
        deserialize(state.history.pop(), { trackHistory: false, notifyListeners: false });
        notify(op);
        return true;
      }
      case 'REDO': {
        if (!state.future.length) return false;
        state.history.push(serialize());
        deserialize(state.future.pop(), { trackHistory: false, notifyListeners: false });
        notify(op);
        return true;
      }
      default:
        return false;
    }
  };

  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const getState = () => ({ ...state, gridData: cloneGrid(state.gridData), zones: { ...state.zones } });

  return {
    applyOperation,
    subscribe,
    serialize,
    deserialize,
    getState,
    getCell: (position) => deepClone(getCell(position))
  };
}
