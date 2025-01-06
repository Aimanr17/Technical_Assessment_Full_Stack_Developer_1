import { useEffect, useState } from 'react';
import { ItemCard } from './components/items/ItemCard';
import { ItemForm } from './components/items/ItemForm';
import { Toaster, toast } from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { fetchItems, createItem, updateItem, deleteItem } from './store/itemsSlice';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Item, CreateItemDto, ItemFormData } from './types/item';

function App() {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.items);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [formData, setFormData] = useState<ItemFormData>({
    name: '',
    description: '',
    price: 0
  });

  useEffect(() => {
    dispatch(fetchItems());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleAddItem = () => {
    setSelectedItem(null);
    setFormData({ name: '', description: '', price: 0 });
    setIsFormOpen(true);
  };

  const handleEditItem = (item: Item) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price
    });
    setIsFormOpen(true);
  };

  const handleDeleteItem = async (id: number) => {
    try {
      await dispatch(deleteItem(id)).unwrap();
      toast.success('Item deleted successfully!');
      await dispatch(fetchItems());
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete item');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedItem) {
        await dispatch(updateItem({ 
          id: selectedItem.id, 
          data: {
            name: formData.name,
            description: formData.description,
            price: formData.price
          }
        })).unwrap();
        toast.success('Item updated successfully!');
      } else {
        const createData: CreateItemDto = {
          name: formData.name,
          description: formData.description,
          price: formData.price
        };
        await dispatch(createItem(createData)).unwrap();
        toast.success('Item created successfully!');
      }
      setFormData({ name: '', description: '', price: 0 });
      setSelectedItem(null);
      setIsFormOpen(false);
      await dispatch(fetchItems());
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Items Management</h1>
          <button
            onClick={handleAddItem}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 flex items-center space-x-2 transition-colors duration-200"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Item</span>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                <ItemCard
                  item={item}
                  onEdit={() => handleEditItem(item)}
                  onDelete={() => handleDeleteItem(item.id)}
                />
              </div>
            ))}
          </div>
        )}

        {items.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No items found. Add some items to get started!</p>
          </div>
        )}

        {isFormOpen && (
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-start justify-center pt-20 z-50">
            <div className="w-full max-w-2xl mx-4">
              <ItemForm
                formData={formData}
                selectedItem={selectedItem}
                onSubmit={handleSubmit}
                onChange={handleInputChange}
                onClose={() => setIsFormOpen(false)}
              />
            </div>
          </div>
        )}
      </div>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </div>
  );
}

export default App;