//Routes
const express = require('express');
const routes = express.Router();
const inventoryController = require('../controllers/inventoryController.cjs');

routes.get('/', inventoryController.getInventoryItems);
routes.post('/', inventoryController.addInventoryItem);
routes.put('/:id', inventoryController.updateInventoryItem);
routes.delete('/:id', inventoryController.deleteInventoryItem);

module.exports = routes;