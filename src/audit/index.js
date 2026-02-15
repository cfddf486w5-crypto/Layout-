export function runAudit(gridData) {
  let bins = 0;
  let emptyLabels = 0;
  let zoneCells = 0;

  for (const row of gridData) {
    for (const cell of row) {
      if (cell.type === 'bin') bins += 1;
      if (cell.label && cell.type === 'empty') emptyLabels += 1;
      if (cell.zone) zoneCells += 1;
    }
  }

  return {
    bins,
    emptyLabels,
    zoneCells,
    hasIssues: emptyLabels > 0
  };
}
