export function applyCellVisual(cell, data, { showLabels = true } = {}) {
  cell.className = 'cell';
  cell.classList.add('type-' + (data.type || 'empty'));
  if (data.zone) cell.classList.add('zone' + data.zone);
  cell.textContent = showLabels && data.label ? data.label : '';
}
