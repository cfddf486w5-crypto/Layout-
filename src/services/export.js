export function buildExportObject({ rows, cols, data, caseTypes = [] }) {
  return { rows, cols, data, caseTypes, version: 'v10', brand: 'Damour Logistique' };
}

export function toCsvRows(gridData) {
  const out = ['row,col,type,caseTypeId,label,binId,depth,isHead,direction,zone'];
  gridData.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      out.push([
        rowIndex + 1,
        colIndex + 1,
        cell.type || '',
        cell.caseTypeId || cell.type || 'empty',
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
