const express = require('express');
const logger = require('./middleware/logger');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// Temel Middleware: Her isteği loglar (hatalı istekler de loglansın diye en başta)
app.use(logger);

// Gövdedeki JSON verisini okuyabilmek için
app.use(express.json());

// Sağlık kontrolü / karşılama
app.get('/', (req, res) => {
  res.json({
    name: 'TaskFlow API',
    version: '1.0.0',
    endpoints: {
      list: 'GET /tasks',
      detail: 'GET /tasks/:id',
      create: 'POST /tasks',
      update: 'PUT /tasks/:id',
      remove: 'DELETE /tasks/:id'
    }
  });
});

// Görev route'ları
app.use('/tasks', taskRoutes);

// 404 ve genel hata yakalayıcı (en sonda olmalı)
app.use(notFound);
app.use(errorHandler);

module.exports = app;
