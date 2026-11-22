# Receptų programėlė

React programėlė su prisijungimu ir mėgstamiausių receptų saugojimu.
Receptai imami iš DummyJSON API, naudotojai ir mėgstamieji saugomi `db.json` per `json-server`.

## Versijos

- Node.js 19.3.1 ar naujesnė
- React, Vite, react-router-dom: žr. `package.json`
- json-server: **0.17.4** (naujesnės versijos veikia kitaip ir su šiuo projektu gali neveikti)

Tikslias versijas fiksuoja failas `package-lock.json`.

## Diegimas

```bash
npm install
```

## Paleidimas

Reikia dviejų terminalų.

1. Serveris (http://localhost:3001):

```bash
npm run server
```

2. React programa (http://localhost:5173):

```bash
npm run dev
```
