# 5S Számkereső Szimulátor

- **ID:** 050-002
- **Kategória:** HTML Szimulátorok
- **Létrehozva:** 2026-02-04
- **Státusz:** KÉSZ (production-ready)
- **Prioritás:** -
- **GitHub:** `rkesztler-collab/5S-Simulator` (saját repo)

## Leírás

Interaktív 5S módszertan oktatójáték. A játékosok számokat (1-30) keresnek
sorrendben, miközben 6 körön keresztül megtapasztalják az 5S elvek hatását
a munkahely hatékonyságára.

## 6 kör (5S elvek)

1. **Káosz** — Kiindulás: rendezetlen munkaterület
2. **Seiri (Szortírozás)** — Felesleges elemek eltávolítása
3. **Seiton (Rendszerezés)** — Zónákba szervezés
4. **Seiso (Tisztítás)** — Munkaterület tisztítása
5. **Seiketsu (Szabványosítás)** — Színkódolás és címkézés
6. **Shitsuke (Fenntartás)** — Tökéletes rend

## Főbb funkciók

- 6 körös progresszív játékmenet
- Valós idejű teljesítmény mérés (idő, hibák, pontszám)
- Eredményrendszer (achievements)
- Kétnyelvű felület (HU/EN)
- Sötét téma (azonos a Lean Simulator designnal)
- Hangeffektek (Web Audio API)
- LocalStorage mentés
- Reszponzív design
- Akadálymentesség (ARIA)

## Technológia

- **HTML5 + CSS3 + Vanilla JavaScript** (ES6+)
- **Nincs függőség** - teljesen standalone
- **Nincs build process** - file:// protokollon fut

## Fájl struktúra

```
index.html              — Fő alkalmazás (12 KB)
css/styles.css          — Stílusok (22 KB)
css/modules/_variables.css — Design tokenek (3.3 KB)
js/app.js               — Fő logika (22 KB)
js/game-engine.js       — Játékmotor (9.8 KB)
js/constants.js         — Konstansok, konfigurációk
js/i18n.js              — Fordítások (HU/EN)
js/audio.js             — Hangeffektek
js/storage.js           — LocalStorage kezelés
```

## Kapcsolódó projektek

- 050-001 Lean Simulator → Azonos design rendszer, hasonló architektúra
- `000-TEMPLATES\_SHARED-DESIGN\` → Közös stíluselemek
