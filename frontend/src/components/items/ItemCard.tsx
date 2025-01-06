import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Item } from '../../types/item';

interface ItemCardProps {
  item: Item;
  onEdit: (item: Item) => void;
  onDelete: (id: number) => void;
}

export const ItemCard = ({ item, onEdit, onDelete }: ItemCardProps) => {
  const formattedPrice = new Intl.NumberFormat('en-MY', {
    style: 'currency',
    currency: 'MYR',
  }).format(item.price);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-200">
      <div className="h-2 bg-gradient-to-r from-purple-600 to-indigo-600" />
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex-grow pr-4">
            {item.name}
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(item)}
              className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
              title="Edit item"
            >
              <PencilIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="text-red-600 hover:text-red-800 transition-colors duration-200"
              title="Delete item"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <p className="text-gray-600 mb-4">
          {item.description || 'No description available'}
        </p>
        
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">
            Price: <span className="font-semibold text-gray-900">{formattedPrice}</span>
          </span>
          <span className="text-gray-500">
            ID: <span className="font-mono text-gray-900">#{item.id}</span>
          </span>
        </div>
      </div>
    </div>
  );
};