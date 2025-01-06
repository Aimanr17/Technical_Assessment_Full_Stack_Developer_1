"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteItem = exports.updateItem = exports.createItem = exports.getItemById = exports.getAllItems = void 0;
const item_model_1 = __importDefault(require("../models/item.model"));
const getAllItems = async () => {
    try {
        console.log('[ItemService] Getting all items');
        const items = await item_model_1.default.findAll();
        console.log(`[ItemService] Found ${items.length} items`);
        return items.map(item => {
            const data = item.toJSON();
            return {
                ...data,
                price: parseFloat(data.price.toString()) // Ensure price is converted to number
            };
        });
    }
    catch (error) {
        console.error('[ItemService] Error getting all items:', error);
        throw error;
    }
};
exports.getAllItems = getAllItems;
const getItemById = async (id) => {
    try {
        console.log(`[ItemService] Getting item by id: ${id}`);
        const item = await item_model_1.default.findByPk(id);
        if (!item) {
            console.log(`[ItemService] Item ${id} not found`);
            throw new Error('Item not found');
        }
        console.log(`[ItemService] Found item ${id}:`, item.toJSON());
        const data = item.toJSON();
        return {
            ...data,
            price: parseFloat(data.price.toString()) // Ensure price is converted to number
        };
    }
    catch (error) {
        console.error(`[ItemService] Error getting item ${id}:`, error);
        throw error;
    }
};
exports.getItemById = getItemById;
const createItem = async (itemData) => {
    try {
        console.log('[ItemService] Creating new item:', itemData);
        const item = await item_model_1.default.create({
            ...itemData,
            price: parseFloat(itemData.price.toString()) // Ensure price is converted to number
        });
        console.log('[ItemService] Created item:', item.toJSON());
        const data = item.toJSON();
        return {
            ...data,
            price: parseFloat(data.price.toString())
        };
    }
    catch (error) {
        console.error('[ItemService] Error creating item:', error);
        throw error;
    }
};
exports.createItem = createItem;
const updateItem = async (id, itemData) => {
    try {
        console.log(`[ItemService] Updating item ${id}:`, itemData);
        const item = await item_model_1.default.findByPk(id);
        if (!item) {
            console.log(`[ItemService] Item ${id} not found`);
            throw new Error('Item not found');
        }
        const updatedData = {
            ...itemData,
            price: itemData.price ? parseFloat(itemData.price.toString()) : undefined
        };
        const updatedItem = await item.update(updatedData);
        console.log(`[ItemService] Updated item ${id}:`, updatedItem.toJSON());
        const data = updatedItem.toJSON();
        return {
            ...data,
            price: parseFloat(data.price.toString())
        };
    }
    catch (error) {
        console.error(`[ItemService] Error updating item ${id}:`, error);
        throw error;
    }
};
exports.updateItem = updateItem;
const deleteItem = async (id) => {
    try {
        console.log(`[ItemService] Deleting item ${id}`);
        const item = await item_model_1.default.findByPk(id);
        if (!item) {
            console.log(`[ItemService] Item ${id} not found`);
            throw new Error('Item not found');
        }
        await item.destroy();
        console.log(`[ItemService] Successfully deleted item ${id}`);
    }
    catch (error) {
        console.error(`[ItemService] Error deleting item ${id}:`, error);
        throw error;
    }
};
exports.deleteItem = deleteItem;
//# sourceMappingURL=item.service.js.map