export function buildExportObject({ rows, cols, data }) {
  return { rows, cols, data, version: 'v9', brand: 'Damour Logistique' };
}

export function toCsvRows(gridData) {
  const out = ['row,col,type,label,binId,depth,isHead,direction,zone'];
  gridData.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      out.push([
        rowIndex + 1,
        colIndex + 1,
        cell.type || '',
        (cell.label || '').replaceAll('"', '""'),
        cell.binId || '',
        cell.depth ?? '',
        cell.isHead ? 1 : 0,
        cell.direction || '',
        cell.zone || ''
      ].join(','));
    });
  });
  return out;
}
