import { PlusIcon } from '@heroicons/react/24/outline';

export const Navbar = ({ onAddItem }: { onAddItem: () => void }) => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <h1 className="text-xl font-bold text-gray-900">Item Manager</h1>
          </div>
          <div className="flex items-center">
            <button
              onClick={onAddItem}
              className="btn btn-primary flex items-center space-x-2"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Add Item</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
