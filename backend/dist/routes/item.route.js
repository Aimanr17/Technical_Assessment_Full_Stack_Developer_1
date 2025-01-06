"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const item_controller_1 = require("../controllers/item.controller");
const router = (0, express_1.Router)();
// Get all items
router.get('/', item_controller_1.getAllItemsController);
// Get single item by ID
router.get('/:id', item_controller_1.getItemByIdController);
// Create new item
router.post('/', item_controller_1.createItemController);
// Update item
router.put('/:id', item_controller_1.updateItemController);
// Delete item
router.delete('/:id', item_controller_1.deleteItemController);
exports.default = router;
