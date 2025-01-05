import Item from '../models/item.model';

export const getAllItems = async () => {
  const items = await Item.findAll();
  return items.map(item => {
    const data = item.toJSON();
    return {
      ...data,
      price: parseFloat(data.price.toString()) // Ensure price is converted to number
    };
  });
};

export const getItemById = async (id: number) => {
  const item = await Item.findByPk(id);
  if (!item) {
    throw new Error('Item not found');
  }
  const data = item.toJSON();
  return {
    ...data,
    price: parseFloat(data.price.toString()) // Ensure price is converted to number
  };
};

export const createItem = async (itemData: { name: string; description?: string; price: number }) => {
  const item = await Item.create({
    ...itemData,
    price: parseFloat(itemData.price.toString()) // Ensure price is converted to number
  });
  const data = item.toJSON();
  return {
    ...data,
    price: parseFloat(data.price.toString())
  };
};

export const updateItem = async (id: number, itemData: Partial<{ name: string; description?: string; price: number }>) => {
  const item = await Item.findByPk(id);
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

export const deleteItem = async (id: number) => {
  const item = await Item.findByPk(id);
  if (!item) {
    throw new Error('Item not found');
  }
  await item.destroy();
};