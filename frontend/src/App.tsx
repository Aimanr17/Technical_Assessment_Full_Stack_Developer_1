import { useEffect, useState } from 'react';
import { ItemCard } from './components/items/ItemCard';
import { ItemForm } from './components/items/ItemForm';
import { Toaster, toast } from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { fetchItems, createItem, updateItem, deleteItem } from './store/itemsSlice';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Item, CreateItemDto, UpdateItemDto } from './types/item';

function App() {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.items);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  useEffect(() => {
    dispatch(fetchItems());
  }, [dispatch]);

  const handleAddItem = () => {
    setSelectedItem(null);
    setIsFormOpen(true);
  };

  const handleEditItem = (item: Item) => {
    setSelectedItem(item);
    setIsFormOpen(true);
  };

  const handleDeleteItem = async (id: number) => {
    try {
      await dispatch(deleteItem(id)).unwrap();
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  const handleFormSubmit = async (formData: CreateItemDto | UpdateItemDto) => {
    try {
      if (selectedItem) {
        await dispatch(updateItem({ id: selectedItem.id, data: formData })).unwrap();
      } else {
        await dispatch(createItem(formData)).unwrap();
      }
      setIsFormOpen(false);
      setSelectedItem(null);
    } catch (error) {
      console.error('Failed to save item:', error);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="w-full max-w-lg mx-auto px-4">
          <div className="bg-white shadow-lg rounded-xl p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Unable to connect to the server</h2>
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={() => {
                dispatch(fetchItems());
                toast.loading('Retrying connection...', { id: 'retry' });
              }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Retry Connection
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Toaster position="top-right" />
      
      <div className="min-h-screen w-full p-4">
        <div className="flex justify-between items-center mb-6 px-2">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
            Item Manager
          </h1>
          <button
            onClick={handleAddItem}
            className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Item
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-lg p-6 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            {items.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onEdit={handleEditItem}
                onDelete={handleDeleteItem}
              />
            ))}
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-gray-500">
              No items found. Click "Add Item" to create one.
            </p>
          </div>
        )}
      </div>

      <ItemForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        item={selectedItem}
      />
    </div>
  );
}

export default App;
