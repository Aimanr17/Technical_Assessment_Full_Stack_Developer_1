import { Request, Response, NextFunction } from 'express';
import { getAllItems, getItemById, createItem, updateItem, deleteItem } from "../services/item.service";
import { createItemSchema, updateItemSchema } from '../validators/item.validator';

export const getAllItemsController = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('[getAllItemsController] Getting all items');
    const items = await getAllItems();
    console.log(`[getAllItemsController] Found ${items.length} items`);
    res.status(200).json(items);
  } catch (err) {
    console.error('[getAllItemsController] Error:', err);
    next(err);
  }
};

export const getItemByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    console.log(`[getItemByIdController] Getting item with id: ${id}`);
    const item = await getItemById(id);
    console.log(`[getItemByIdController] Found item:`, item);
    res.status(200).json(item);
  } catch (err) {
    console.error(`[getItemByIdController] Error getting item ${req.params.id}:`, err);
    if (err instanceof Error && err.message === 'Item not found') {
      res.status(404).json({ message: 'Item not found' });
    } else {
      next(err);
    }
  }
};

export const createItemController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('[createItemController] Creating new item:', req.body);
    const validatedData = createItemSchema.parse(req.body);
    const newItem = await createItem(validatedData);
    console.log('[createItemController] Created item:', newItem);
    res.status(201).json(newItem);
  } catch (err) {
    console.error('[createItemController] Error:', err);
    next(err);
  }
};

export const updateItemController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    console.log(`[updateItemController] Updating item ${id}:`, req.body);
    const validatedData = updateItemSchema.parse(req.body);
    const updatedItem = await updateItem(id, validatedData);
    console.log(`[updateItemController] Updated item ${id}:`, updatedItem);
    res.status(200).json(updatedItem);
  } catch (err) {
    console.error(`[updateItemController] Error updating item ${req.params.id}:`, err);
    if (err instanceof Error && err.message === 'Item not found') {
      res.status(404).json({ message: 'Item not found' });
    } else {
      next(err);
    }
  }
};

export const deleteItemController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    console.log(`[deleteItemController] Deleting item ${id}`);
    await deleteItem(id);
    console.log(`[deleteItemController] Deleted item ${id}`);
    res.status(200).send({
      message: 'Item deleted successfully'
    });
  } catch (err) {
    console.error(`[deleteItemController] Error deleting item ${req.params.id}:`, err);
    if (err instanceof Error && err.message === 'Item not found') {
      res.status(404).json({ message: 'Item not found' });
    } else {
      next(err);
    }
  }
};