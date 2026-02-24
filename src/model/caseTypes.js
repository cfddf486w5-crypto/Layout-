const DEFAULT_CASE_TYPE = {
  icon: 'ic_default',
  colorTag: 'neutral',
  layer: 'base',
  zIndex: 50,
  walkable: true,
  blocksMovement: false,
  selectable: true,
  draggable: true,
  snapToGrid: true
};

const CATEGORY_RULES = [
  { matcher: (id) => id.startsWith('wall') || id === 'column' || id === 'dock-pillar' || id === 'barrier-guardrail' || id === 'floor-opening' || id === 'window', category: 'structure', layer: 'base', zIndex: 90, walkable: false, blocksMovement: true, colorTag: 'neutral' },
  { matcher: (id) => id.startsWith('door') || id.startsWith('gate') || id === 'curtain-industrial', category: 'access', layer: 'overlay', zIndex: 80, walkable: true, blocksMovement: false, colorTag: 'info' },
  { matcher: (id) => id.startsWith('rack') || id === 'mezzanine' || id === 'bin-slot' || id.startsWith('bin-') || id === 'floor-stack' || id === 'cage-value' || id === 'empty-pallets', category: 'storage', layer: 'base', zIndex: 70, walkable: false, blocksMovement: true, colorTag: 'neutral' },
  { matcher: (id) => id.startsWith('zone-') || id.startsWith('virtual-') || id === 'tote-zone', category: 'zone', layer: 'overlay', zIndex: 60, walkable: true, blocksMovement: false, colorTag: 'zone' },
  { matcher: (id) => id === 'danger-zone' || id === 'stop-mandatory' || id === 'extinguisher' || id === 'eyewash' || id === 'emergency-exit' || id === 'assembly-point' || id === 'emergency-station', category: 'safety', layer: 'overlay', zIndex: 75, walkable: true, blocksMovement: false, colorTag: 'danger' },
  { matcher: (id) => id === 'work' || id === 'charger' || id === 'electrical' || id === 'conveyor' || id === 'lift-table' || id === 'wrap-station' || id === 'battery-charge', category: 'equipment', layer: 'base', zIndex: 65, walkable: false, blocksMovement: true, colorTag: 'info' },
  { matcher: (id) => id === 'text-label' || id === 'aisle-number' || id === 'measure-marker' || id === 'line-separator' || id === 'icon-info', category: 'annotation', layer: 'annotation', zIndex: 40, walkable: true, blocksMovement: false, colorTag: 'info' },
  { matcher: (id) => id === 'operator-spawn' || id === 'entry-exit-point' || id === 'customer-counter' || id === 'toilet' || id === 'locker-room' || id === 'mechanical-room' || id === 'it-closet' || id === 'waste-recycling' || id === 'cafeteria' || id === 'office' || id === 'dock' || id === 'dock-leveler' || id === 'ramp', category: 'service', layer: 'base', zIndex: 55, walkable: true, blocksMovement: false, colorTag: 'info' },
  { matcher: (id) => id === 'road' || id === 'lane-pedestrian' || id === 'lane-forklift' || id === 'one-way' || id === 'no-entry' || id === 'crosswalk', category: 'wms', layer: 'overlay', zIndex: 58, walkable: true, blocksMovement: false, colorTag: 'info' }
];

function normalizeExportCode(id) {
  return String(id || '')
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toUpperCase() || 'UNKNOWN';
}

function pickRule(id) {
  return CATEGORY_RULES.find((rule) => rule.matcher(id));
}

export function createCaseTypeDefinition(id, label, overrides = {}) {
  const rule = pickRule(id) || {};
  return {
    id,
    label,
    category: rule.category || 'annotation',
    icon: overrides.icon || `ic_${id.replace(/[^a-z0-9]+/gi, '_')}`,
    colorTag: overrides.colorTag || rule.colorTag || DEFAULT_CASE_TYPE.colorTag,
    layer: overrides.layer || rule.layer || DEFAULT_CASE_TYPE.layer,
    zIndex: overrides.zIndex ?? rule.zIndex ?? DEFAULT_CASE_TYPE.zIndex,
    walkable: overrides.walkable ?? rule.walkable ?? DEFAULT_CASE_TYPE.walkable,
    blocksMovement: overrides.blocksMovement ?? rule.blocksMovement ?? DEFAULT_CASE_TYPE.blocksMovement,
    selectable: overrides.selectable ?? DEFAULT_CASE_TYPE.selectable,
    draggable: overrides.draggable ?? DEFAULT_CASE_TYPE.draggable,
    snapToGrid: overrides.snapToGrid ?? DEFAULT_CASE_TYPE.snapToGrid,
    exportCode: overrides.exportCode || normalizeExportCode(id)
  };
}

export function buildCaseTypeCatalog(customToolButtons = []) {
  const catalog = new Map();
  const base = [
    createCaseTypeDefinition('empty', 'Case vide', { category: 'annotation', layer: 'base', zIndex: 0, walkable: true, blocksMovement: false, icon: 'ic_empty', exportCode: 'EMPTY' }),
    createCaseTypeDefinition('bin', 'BIN', { category: 'storage', layer: 'base', zIndex: 70, walkable: false, blocksMovement: true, icon: 'ic_bin', exportCode: 'BIN' }),
    createCaseTypeDefinition('label', 'Texte', { category: 'annotation', layer: 'annotation', zIndex: 42, walkable: true, blocksMovement: false, icon: 'ic_label', exportCode: 'LABEL' })
  ];

  base.forEach((entry) => catalog.set(entry.id, entry));
  customToolButtons.forEach(([id, label]) => {
    if (!catalog.has(id)) catalog.set(id, createCaseTypeDefinition(id, label));
  });

  return catalog;
}

export function getCaseType(catalog, id) {
  return catalog.get(id) || catalog.get('empty');
}
