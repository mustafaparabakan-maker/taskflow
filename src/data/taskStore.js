const fs = require('fs');
const path = require('path');

/**
 * Basit JSON dosyası tabanlı veri katmanı.
 * Veritabanı kullanmadan görevleri data/tasks.json içinde saklar,
 * böylece sunucu yeniden başlatıldığında veriler kaybolmaz.
 */
const DATA_FILE = path.join(__dirname, '..', '..', 'data', 'tasks.json');

function readAll() {
  if (!fs.existsSync(DATA_FILE)) return [];
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return raw.trim() ? JSON.parse(raw) : [];
}

function writeAll(tasks) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2), 'utf-8');
}

function nextId(tasks) {
  return tasks.length ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
}

module.exports = { readAll, writeAll, nextId };
