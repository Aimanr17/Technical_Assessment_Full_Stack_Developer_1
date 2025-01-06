import { XMarkIcon } from '@heroicons/react/24/outline';
import { Item, ItemFormData } from '../../types/item';

interface ItemFormProps {
  formData: ItemFormData;
  selectedItem: Item | null;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onClose: () => void;
}

export const ItemForm = ({
  formData,
  selectedItem,
  onSubmit,
  onChange,
  onClose
}: ItemFormProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-white">
            {selectedItem ? 'Edit Item' : 'Add New Item'}
          </h3>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors duration-200"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
      </div>

      <form onSubmit={onSubmit} className="p-6">
        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={onChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 placeholder-gray-600 text-gray-900"
              placeholder="Enter item name"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              id="description"
              value={formData.description}
              onChange={onChange}
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none placeholder-gray-600 text-gray-900"
              placeholder="Enter item description"
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price (MYR)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-600">RM</span>
              <input
                type="number"
                name="price"
                id="price"
                value={formData.price || ''}
                onChange={onChange}
                required
                min="0"
                step="0.01"
                className="w-full pl-12 pr-4 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 placeholder-gray-600 text-gray-900"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-8">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 font-medium transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg text-white bg-blue-500 hover:bg-blue-600 font-medium transition-colors duration-200"
          >
            {selectedItem ? 'Update Item' : 'Create Item'}
          </button>
        </div>
      </form>
    </div>
  );
};