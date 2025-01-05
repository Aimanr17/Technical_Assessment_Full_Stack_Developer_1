import { Router } from "express";
import {
  getAllItemsController,
  getItemByIdController,
  createItemController,
  updateItemController,
  deleteItemController
} from "../controllers/item.controller";

const router = Router();

// Get all items
router.get('/', getAllItemsController);

// Get single item by ID
router.get('/:id', getItemByIdController);

// Create new item
router.post('/', createItemController);

// Update item
router.put('/:id', updateItemController);

// Delete item
router.delete('/:id', deleteItemController);

export default router;