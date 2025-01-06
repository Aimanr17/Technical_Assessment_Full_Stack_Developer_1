"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateItemSchema = exports.createItemSchema = void 0;
const zod_1 = require("zod");
exports.createItemSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100),
    description: zod_1.z.string().max(500).optional(),
    price: zod_1.z.number().positive(),
});
exports.updateItemSchema = exports.createItemSchema.partial();
