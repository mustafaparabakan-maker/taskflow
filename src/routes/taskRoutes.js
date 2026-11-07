const express = require('express');
const taskController = require('../controllers/taskController');

const router = express.Router();

router.get('/', taskController.getAllTasks);      // Görev Listeleme
router.get('/:id', taskController.getTaskById);   // Görev Detayı
router.post('/', taskController.createTask);      // Görev Ekleme
router.put('/:id', taskController.updateTask);    // Görev Güncelleme
router.delete('/:id', taskController.deleteTask); // Görev Silme

module.exports = router;
