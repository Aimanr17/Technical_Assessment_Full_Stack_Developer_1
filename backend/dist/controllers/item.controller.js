"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteItemController = exports.updateItemController = exports.createItemController = exports.getItemByIdController = exports.getAllItemsController = void 0;
const item_service_1 = require("../services/item.service");
const item_validator_1 = require("../validators/item.validator");
const getAllItemsController = async (req, res, next) => {
    try {
        console.log('[getAllItemsController] Getting all items');
        const items = await (0, item_service_1.getAllItems)();
        console.log(`[getAllItemsController] Found ${items.length} items`);
        res.status(200).json(items);
    }
    catch (err) {
        console.error('[getAllItemsController] Error:', err);
        next(err);
    }
};
exports.getAllItemsController = getAllItemsController;
const getItemByIdController = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        console.log(`[getItemByIdController] Getting item with id: ${id}`);
        const item = await (0, item_service_1.getItemById)(id);
        console.log(`[getItemByIdController] Found item:`, item);
        res.status(200).json(item);
    }
    catch (err) {
        console.error(`[getItemByIdController] Error getting item ${req.params.id}:`, err);
        if (err instanceof Error && err.message === 'Item not found') {
            res.status(404).json({ message: 'Item not found' });
        }
        else {
            next(err);
        }
    }
};
exports.getItemByIdController = getItemByIdController;
const createItemController = async (req, res, next) => {
    try {
        console.log('[createItemController] Creating new item:', req.body);
        const validatedData = item_validator_1.createItemSchema.parse(req.body);
        const newItem = await (0, item_service_1.createItem)(validatedData);
        console.log('[createItemController] Created item:', newItem);
        res.status(201).json(newItem);
    }
    catch (err) {
        console.error('[createItemController] Error:', err);
        if (err instanceof Error && err.name === 'ZodError') {
            res.status(400).json({ message: 'Invalid input data', errors: err });
        }
        else {
            next(err);
        }
    }
};
exports.createItemController = createItemController;
const updateItemController = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        console.log(`[updateItemController] Updating item ${id}:`, req.body);
        const validatedData = item_validator_1.updateItemSchema.parse(req.body);
        const updatedItem = await (0, item_service_1.updateItem)(id, validatedData);
        console.log('[updateItemController] Updated item:', updatedItem);
        res.status(200).json(updatedItem);
    }
    catch (err) {
        console.error(`[updateItemController] Error updating item ${req.params.id}:`, err);
        if (err instanceof Error) {
            if (err.message === 'Item not found') {
                res.status(404).json({ message: 'Item not found' });
            }
            else if (err.name === 'ZodError') {
                res.status(400).json({ message: 'Invalid input data', errors: err });
            }
            else {
                next(err);
            }
        }
        else {
            next(err);
        }
    }
};
exports.updateItemController = updateItemController;
const deleteItemController = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        console.log(`[deleteItemController] Deleting item ${id}`);
        await (0, item_service_1.deleteItem)(id);
        console.log(`[deleteItemController] Successfully deleted item ${id}`);
        res.status(204).send();
    }
    catch (err) {
        console.error(`[deleteItemController] Error deleting item ${req.params.id}:`, err);
        if (err instanceof Error && err.message === 'Item not found') {
            res.status(404).json({ message: 'Item not found' });
        }
        else {
            next(err);
        }
    }
};
exports.deleteItemController = deleteItemController;
//# sourceMappingURL=item.controller.js.map