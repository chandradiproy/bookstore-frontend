// The main dashboard, now with a predefined genre filter.

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';
import {
  useGetBooksQuery,
  useAddBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
} from '../redux/features/api/apiSlice';
import { GENRES } from '../utils/constants'; // <-- Import the genres

import BookCard from '../components/BookCard';
import Modal from '../components/Modal';
import BookForm from '../components/BookForm';
import Loader from '../components/Loader';

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);
  const [genreFilter, setGenreFilter] = useState('');

  // RTK Query hooks
  const { data: booksData, isLoading, isError, error } = useGetBooksQuery({ genre: genreFilter });
  const [addBook, { isLoading: isAdding }] = useAddBookMutation();
  const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation();
  const [deleteBook] = useDeleteBookMutation();

  const handleAddClick = () => {
    setCurrentBook(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (book) => {
    setCurrentBook(book);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await deleteBook(id).unwrap();
        toast.success('Book deleted successfully!');
      } catch (err) {
        toast.error(err?.data?.error?.message || 'Failed to delete book.');
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (currentBook) {
        await updateBook({ id: currentBook.id, ...formData }).unwrap();
        toast.success('Book updated successfully!');
      } else {
        await addBook(formData).unwrap();
        toast.success('Book added successfully!');
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err?.data?.error?.message || 'Failed to save book.');
    }
  };

  if (isError) {
    return <div className="text-center text-red-500">Error: {error.data?.error?.message || 'Failed to fetch books.'}</div>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Your Bookshelf</h1>
        <div className="flex items-center gap-4">
          {/* --- UPDATED GENRE FILTER --- */}
          <select
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Genres</option>
            {GENRES.map(genre => <option key={genre} value={genre}>{genre}</option>)}
          </select>
          <button
            onClick={handleAddClick}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus size={20} />
            <span>Add Book</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {booksData?.books?.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}
      
      {booksData?.books?.length === 0 && !isLoading && (
        <div className="text-center py-10">
          <h3 className="text-xl text-gray-600">No books found.</h3>
          <p className="text-gray-500 mt-2">Click "Add Book" to get started!</p>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentBook ? 'Edit Book' : 'Add New Book'}
      >
        <BookForm
          initialData={currentBook}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
          isLoading={isAdding || isUpdating}
        />
      </Modal>
    </div>
  );
}
