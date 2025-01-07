"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const item_controller_1 = require("../controllers/item.controller");
const router = (0, express_1.Router)();
router.get('/', item_controller_1.getAllItemsController);
router.get('/:id', item_controller_1.getItemByIdController);
router.post('/', item_controller_1.createItemController);
router.put('/:id', item_controller_1.updateItemController);
router.delete('/:id', item_controller_1.deleteItemController);
exports.default = router;
//# sourceMappingURL=item.route.js.map