import Item from '../models/item.model';

export const getAllItems = async () => {
  try {
    console.log('[ItemService] Getting all items');
    const items = await Item.findAll();
    console.log(`[ItemService] Found ${items.length} items`);
    return items.map(item => {
      const data = item.toJSON();
      return {
        ...data,
        price: parseFloat(data.price.toString())
      };
    });
  } catch (error) {
    console.error('[ItemService] Error getting all items:', error);
    throw error;
  }
};

export const getItemById = async (id: number) => {
  try {
    console.log(`[ItemService] Getting item by id: ${id}`);
    const item = await Item.findByPk(id);
    if (!item) {
      console.log(`[ItemService] Item ${id} not found`);
      throw new Error('Item not found');
    }
    console.log(`[ItemService] Found item ${id}:`, item.toJSON());
    const data = item.toJSON();
    return {
      ...data,
      price: parseFloat(data.price.toString())
    };
  } catch (error) {
    console.error(`[ItemService] Error getting item ${id}:`, error);
    throw error;
  }
};

export const createItem = async (itemData: { name: string; description?: string; price: number }) => {
  try {
    console.log('[ItemService] Creating new item:', itemData);
    const item = await Item.create({
      ...itemData,
      price: parseFloat(itemData.price.toString())
    });
    console.log('[ItemService] Created item:', item.toJSON());
    const data = item.toJSON();
    return {
      ...data,
      price: parseFloat(data.price.toString())
    };
  } catch (error) {
    console.error('[ItemService] Error creating item:', error);
    throw error;
  }
};

export const updateItem = async (id: number, itemData: Partial<{ name: string; description?: string; price: number }>) => {
  try {
    console.log(`[ItemService] Updating item ${id}:`, itemData);
    const item = await Item.findByPk(id);
    if (!item) {
      console.log(`[ItemService] Item ${id} not found`);
      throw new Error('Item not found');
    }

    if (itemData.price) {
      itemData.price = parseFloat(itemData.price.toString());
    }

    await item.update(itemData);
    console.log(`[ItemService] Updated item ${id}:`, item.toJSON());
    const data = item.toJSON();
    return {
      ...data,
      price: parseFloat(data.price.toString())
    };
  } catch (error) {
    console.error(`[ItemService] Error updating item ${id}:`, error);
    throw error;
  }
};

export const deleteItem = async (id: number) => {
  try {
    console.log(`[ItemService] Deleting item ${id}`);
    const item = await Item.findByPk(id);
    if (!item) {
      console.log(`[ItemService] Item ${id} not found`);
      throw new Error('Item not found');
    }
    await item.destroy();
    console.log(`[ItemService] Deleted item ${id}`);
  } catch (error) {
    console.error(`[ItemService] Error deleting item ${id}:`, error);
    throw error;
  }
};