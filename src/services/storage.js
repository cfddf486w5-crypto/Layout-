export const STORAGE_KEY = 'dl_shop_layout_v9';
export const ZONES_KEY = 'dl_zonenames_v9';

export function loadLayoutFromStorage() {
  return localStorage.getItem(STORAGE_KEY);
}

export function saveLayoutToStorage(payload) {
  localStorage.setItem(STORAGE_KEY, payload);
}

export function loadZoneNamesFromStorage() {
  return localStorage.getItem(ZONES_KEY);
}

export function saveZoneNamesToStorage(payload) {
  localStorage.setItem(ZONES_KEY, payload);
}
