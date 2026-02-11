SHOP Layout – Version PWA (V7)

Interface iPhone:
- Menus ouvrables uniquement en haut (pas de panneaux flottants)
- Outils / Actions / Données / Infos

PWA / Hors-ligne:
- Service Worker + cache.
- IMPORTANT: ça ne marche pas en ouvrant index.html en "fichier" (file://).
  Il faut servir via https:// (ou http://localhost) pour enregistrer le service worker.

Installation iPhone:
- Ouvre le site dans Safari → bouton Partager → "Sur l’écran d’accueil".

Test rapide:
- Une fois installé, coupe le Wi‑Fi: l’app doit s’ouvrir (offline).

Mise à jour:
- Change CACHE_NAME dans service-worker.js et recharge.
