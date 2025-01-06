"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteItem = exports.updateItem = exports.createItem = exports.getItemById = exports.getAllItems = void 0;
const item_model_1 = __importDefault(require("../models/item.model"));
const getAllItems = async () => {
    const items = await item_model_1.default.findAll();
    return items.map(item => {
        const data = item.toJSON();
        return {
            ...data,
            price: parseFloat(data.price.toString()) // Ensure price is converted to number
        };
    });
};
exports.getAllItems = getAllItems;
const getItemById = async (id) => {
    const item = await item_model_1.default.findByPk(id);
    if (!item) {
        throw new Error('Item not found');
    }
    const data = item.toJSON();
    return {
        ...data,
        price: parseFloat(data.price.toString()) // Ensure price is converted to number
    };
};
exports.getItemById = getItemById;
const createItem = async (itemData) => {
    const item = await item_model_1.default.create({
        ...itemData,
        price: parseFloat(itemData.price.toString()) // Ensure price is converted to number
    });
    const data = item.toJSON();
    return {
        ...data,
        price: parseFloat(data.price.toString())
    };
};
exports.createItem = createItem;
const updateItem = async (id, itemData) => {
    const item = await item_model_1.default.findByPk(id);
    if (!item) {
        throw new Error('Item not found');
    }
    const updatedData = {
        ...itemData,
        price: itemData.price ? parseFloat(itemData.price.toString()) : undefined
    };
    const updatedItem = await item.update(updatedData);
    const data = updatedItem.toJSON();
    return {
        ...data,
        price: parseFloat(data.price.toString())
    };
};
exports.updateItem = updateItem;
const deleteItem = async (id) => {
    const item = await item_model_1.default.findByPk(id);
    if (!item) {
        throw new Error('Item not found');
    }
    await item.destroy();
};
exports.deleteItem = deleteItem;
//# sourceMappingURL=item.service.js.map