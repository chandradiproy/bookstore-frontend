// Displays a single book with edit and delete buttons.

import { Pencil, Trash2 } from 'lucide-react';

export default function BookCard({ book, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:-translate-y-1">
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-indigo-700">{book.title}</h3>
        <p className="text-gray-600 mb-1">by {book.author}</p>
        <div className="flex items-center justify-between text-sm text-gray-500 mt-4">
          <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">{book.genre}</span>
          <span>{book.publishedYear}</span>
        </div>
      </div>
      <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3">
        <button onClick={() => onEdit(book)} className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
          <Pencil size={20} />
        </button>
        <button onClick={() => onDelete(book.id)} className="p-2 text-gray-500 hover:text-red-600 transition-colors">
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
}
