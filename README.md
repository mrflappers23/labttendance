# LabTrack admin

React + Vite + Tailwind CSS admin pages for the LabTrack laboratory attendance system.
It uses sample data stored in the browser, so changes reset when you reload.

## Run it

1. Install Node.js 20 or newer from https://nodejs.org
2. Extract this folder, open a terminal inside it (the folder that contains `package.json`)
3. Run:

```
npm install
npm run dev
```

4. Open the address it prints (usually http://localhost:5173)

## Pages

| Address | Page |
|---|---|
| /dashboard | Stats, weekly chart, recent scans |
| /students | Searchable students, click one for details and history |
| /live | Who is in a lab now, with a Time out button |
| /qr | Real QR codes for each lab, plus a scan simulator |
| /records | All sessions with search and a lab filter |
| /reports | Totals, averages, sessions per lab |
| /settings | Profile form |

## Where things are

- `src/data.js`: sample students, labs and attendance records
- `src/App.jsx`: the state (records) and the routes
- `src/Layout.jsx`: sidebar and top bar
- `src/pages/`: one file per page
- `src/index.css`: the brand colors (green) used by Tailwind
