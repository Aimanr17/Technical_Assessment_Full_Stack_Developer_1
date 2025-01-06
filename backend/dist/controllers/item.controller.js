"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteItemController = exports.updateItemController = exports.createItemController = exports.getItemByIdController = exports.getAllItemsController = void 0;
const item_service_1 = require("../services/item.service");
const item_validator_1 = require("../validators/item.validator");
const getAllItemsController = async (req, res, next) => {
    try {
        const items = await (0, item_service_1.getAllItems)();
        res.status(200).json(items);
    }
    catch (err) {
        next(err);
    }
};
exports.getAllItemsController = getAllItemsController;
const getItemByIdController = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const item = await (0, item_service_1.getItemById)(id);
        res.status(200).json(item);
    }
    catch (err) {
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
        const validatedData = item_validator_1.createItemSchema.parse(req.body);
        const item = await (0, item_service_1.createItem)(validatedData);
        res.status(201).json(item);
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ message: err.message });
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
        const validatedData = item_validator_1.updateItemSchema.parse(req.body);
        const item = await (0, item_service_1.updateItem)(id, validatedData);
        res.status(200).json(item);
    }
    catch (err) {
        if (err instanceof Error) {
            if (err.message === 'Item not found') {
                res.status(404).json({ message: 'Item not found' });
            }
            else {
                res.status(400).json({ message: err.message });
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
        await (0, item_service_1.deleteItem)(id);
        res.status(204).send();
    }
    catch (err) {
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