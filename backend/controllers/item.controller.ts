import { Request, Response, NextFunction } from 'express';
import { getAllItems, getItemById, createItem, updateItem, deleteItem } from "../services/item.service";
import { createItemSchema, updateItemSchema } from '../validators/item.validator';

export const getAllItemsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const items = await getAllItems();
    res.status(200).json(items);
  } catch (err) {
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
    const item = await getItemById(id);
    res.status(200).json(item);
  } catch (err) {
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
    const validatedData = createItemSchema.parse(req.body);
    const item = await createItem(validatedData);
    res.status(201).json(item);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ message: err.message });
    } else {
      next(err);
    }
  }
};

export const updateItemController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    const validatedData = updateItemSchema.parse(req.body);
    const item = await updateItem(id, validatedData);
    res.status(200).json(item);
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === 'Item not found') {
        res.status(404).json({ message: 'Item not found' });
      } else {
        res.status(400).json({ message: err.message });
      }
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
    await deleteItem(id);
    res.status(204).send();
  } catch (err) {
    if (err instanceof Error && err.message === 'Item not found') {
      res.status(404).json({ message: 'Item not found' });
    } else {
      next(err);
    }
  }
};