export function createVisionAdapter(impl = {}) {
  return {
    detectBins: impl.detectBins || (async () => []),
    detectZones: impl.detectZones || (async () => []),
    healthcheck: impl.healthcheck || (async () => ({ ok: true, source: 'noop' }))
  };
}
