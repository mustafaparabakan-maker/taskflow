const store = require('../data/taskStore');

const STATUSES = ['pending', 'in-progress', 'completed'];
const PRIORITIES = ['low', 'medium', 'high'];

// Yardımcı: URL'deki id'yi sayıya çevirir ve görevi bulur
function findTask(tasks, idParam) {
  const id = Number(idParam);
  return { id, index: tasks.findIndex((t) => t.id === id) };
}

// GET /tasks — Tüm görevleri listeler
function getAllTasks(req, res) {
  const tasks = store.readAll();
  res.status(200).json({ success: true, count: tasks.length, data: tasks });
}

// GET /tasks/:id — Tek bir görevin detayını getirir
function getTaskById(req, res) {
  const tasks = store.readAll();
  const { id, index } = findTask(tasks, req.params.id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: `${id} numaralı görev bulunamadı` });
  }
  res.status(200).json({ success: true, data: tasks[index] });
}

// POST /tasks — Yeni görev oluşturur
function createTask(req, res) {
  const { title, description = '', status = 'pending', priority = 'medium', assignee = null, project = null } = req.body || {};

  // Temel zorunlu alan kontrolü (kapsamlı validation isteğe bağlı bölümde)
  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ success: false, message: 'title alanı zorunludur' });
  }
  if (!STATUSES.includes(status)) {
    return res.status(400).json({ success: false, message: `status şunlardan biri olmalı: ${STATUSES.join(', ')}` });
  }
  if (!PRIORITIES.includes(priority)) {
    return res.status(400).json({ success: false, message: `priority şunlardan biri olmalı: ${PRIORITIES.join(', ')}` });
  }

  const tasks = store.readAll();
  const now = new Date().toISOString();
  const newTask = {
    id: store.nextId(tasks),
    title: title.trim(),
    description,
    status,
    priority,
    assignee,
    project,
    createdAt: now,
    updatedAt: now
  };

  tasks.push(newTask);
  store.writeAll(tasks);

  res.status(201).json({ success: true, message: 'Görev oluşturuldu', data: newTask });
}

// PUT /tasks/:id — Görevi günceller (gönderilen alanlar değişir)
function updateTask(req, res) {
  const tasks = store.readAll();
  const { id, index } = findTask(tasks, req.params.id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: `${id} numaralı görev bulunamadı` });
  }

  const allowed = ['title', 'description', 'status', 'priority', 'assignee', 'project'];
  const updates = {};
  for (const key of allowed) {
    if (req.body && req.body[key] !== undefined) updates[key] = req.body[key];
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ success: false, message: 'Güncellenecek en az bir alan gönderilmelidir' });
  }
  if (updates.title !== undefined && (typeof updates.title !== 'string' || !updates.title.trim())) {
    return res.status(400).json({ success: false, message: 'title boş olamaz' });
  }
  if (updates.status !== undefined && !STATUSES.includes(updates.status)) {
    return res.status(400).json({ success: false, message: `status şunlardan biri olmalı: ${STATUSES.join(', ')}` });
  }
  if (updates.priority !== undefined && !PRIORITIES.includes(updates.priority)) {
    return res.status(400).json({ success: false, message: `priority şunlardan biri olmalı: ${PRIORITIES.join(', ')}` });
  }

  tasks[index] = { ...tasks[index], ...updates, updatedAt: new Date().toISOString() };
  store.writeAll(tasks);

  res.status(200).json({ success: true, message: 'Görev güncellendi', data: tasks[index] });
}

// DELETE /tasks/:id — Görevi siler
function deleteTask(req, res) {
  const tasks = store.readAll();
  const { id, index } = findTask(tasks, req.params.id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: `${id} numaralı görev bulunamadı` });
  }

  const [deleted] = tasks.splice(index, 1);
  store.writeAll(tasks);

  res.status(200).json({ success: true, message: 'Görev silindi', data: deleted });
}

module.exports = { getAllTasks, getTaskById, createTask, updateTask, deleteTask };
