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
              className="p-1.5 text-gray-500 hover:text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
            >
              <PencilIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="p-1.5 text-gray-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="mb-4">
          <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
            {formattedPrice}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4">{item.description}</p>

        <div className="text-xs text-gray-400">
          Added {new Date(item.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};
