# Ewidencja Braków

Aplikacja webowa do ewidencji braków w paczkach – prosta lista, filtrowanie, oznaczanie uzupełnionych i eksport CSV.

## 🚀 Wymagania
- Node.js **18** (wymuszone przez `.nvmrc` i `package.json`)
- npm lub yarn

## 📦 Instalacja lokalna
```bash
git clone <twoje-repo-na-githubie>
cd ewidencja-brakow-node18
npm install
```

## ▶️ Uruchomienie w trybie deweloperskim
```bash
npm start
```
Aplikacja otworzy się na `http://localhost:3000`.

## 🏗 Build produkcyjny
```bash
npm run build
```
Pliki produkcyjne pojawią się w katalogu `build/`.

## ☁️ Deploy na Vercel
1. Wgraj ten projekt na GitHub (z folderami `src/` i `public/`).
2. Wejdź na [Vercel](https://vercel.com), kliknij **New Project**.
3. Wybierz repozytorium z tym projektem.
4. Ustaw `Framework Preset` na **Create React App**.
5. Deploy 🚀.

> Dzięki `"engines": { "node": "18" }` i `.nvmrc`, Vercel użyje Node 18 zamiast Node 22.

## 📑 Funkcje aplikacji
- Dodawanie paczek i brakujących produktów.
- Oznaczanie jako uzupełnione.
- Filtrowanie (wszystkie / oczekujące / uzupełnione).
- Wyszukiwarka po numerze paczki lub nazwie produktu.
- Eksport CSV.

---

💡 Możliwości rozwoju:
- Eksport PDF.
- Archiwizacja zrealizowanych pozycji (>30 dni).
- Integracja ze skanerem kodów kreskowych lub ERP.

