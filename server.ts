import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '15mb' }));

const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.resolve(DATA_DIR, 'db.json');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (e) {
    console.error('Failed to create data dir:', e);
  }
}

interface ServerDb {
  version: number;
  lastUpdated: number;
  settings?: any;
  questions?: any[];
  schedule?: any[];
  teachers?: any[];
  library?: any[];
  promos?: any[];
  announcements?: any[];
  homework?: any[];
  quests?: any[];
  users?: any[];
  rooms?: any[];
  teacher_accounts?: any[];
  board_rooms?: any;
}

function readDb(): ServerDb {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      if (raw.trim()) {
        return JSON.parse(raw);
      }
    }
  } catch (e) {
    console.error('Error reading db.json:', e);
  }
  return {
    version: 1,
    lastUpdated: Date.now()
  };
}

function writeDb(db: ServerDb): boolean {
  try {
    db.lastUpdated = Date.now();
    db.version = (db.version || 1) + 1;
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
    return true;
  } catch (e) {
    console.error('Error writing db.json:', e);
    return false;
  }
}

// REST API Endpoints for Cross-Device Synchronization

// 1. Get version & timestamp (lightweight polling)
app.get('/api/version', (req, res) => {
  const db = readDb();
  res.json({
    version: db.version || 1,
    lastUpdated: db.lastUpdated || Date.now()
  });
});

// 2. Get full synchronized dataset
app.get('/api/data', (req, res) => {
  const db = readDb();
  res.json(db);
});

// 3. Update single section (schedule, teachers, questions, settings, etc.)
app.post('/api/data/update', (req, res) => {
  const { section, data } = req.body;
  if (!section) {
    return res.status(400).json({ error: 'Section required' });
  }

  const db = readDb();
  (db as any)[section] = data;
  writeDb(db);

  res.json({
    success: true,
    version: db.version,
    lastUpdated: db.lastUpdated,
    section
  });
});

// 4. Batch sync initial data if server is empty
app.post('/api/data/sync', (req, res) => {
  const clientPayload = req.body || {};
  const db = readDb();

  let modified = false;
  const sections = [
    'settings', 'questions', 'schedule', 'teachers', 
    'library', 'promos', 'announcements', 'homework', 
    'quests', 'users', 'teacher_accounts', 'board_rooms'
  ];

  for (const s of sections) {
    // If server does not have this section but client does, store it
    if ((!(db as any)[s] || (Array.isArray((db as any)[s]) && (db as any)[s].length === 0)) && clientPayload[s]) {
      (db as any)[s] = clientPayload[s];
      modified = true;
    }
  }

  if (modified) {
    writeDb(db);
  }

  res.json({
    success: true,
    version: db.version,
    data: db
  });
});

// 5. Cross-device Real-Time Multiplayer Rooms
app.get('/api/rooms', (req, res) => {
  const db = readDb();
  res.json({ rooms: db.rooms || [] });
});

app.post('/api/rooms/sync', (req, res) => {
  const { rooms } = req.body;
  if (!Array.isArray(rooms)) {
    return res.status(400).json({ error: 'Rooms must be array' });
  }
  const db = readDb();
  db.rooms = rooms;
  writeDb(db);
  res.json({ success: true, count: rooms.length });
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[29-Maktab] Server running on http://0.0.0.0:${PORT} (env: ${process.env.NODE_ENV || 'development'})`);
  });
}

startServer();
