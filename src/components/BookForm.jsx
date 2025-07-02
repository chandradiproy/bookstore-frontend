// A form for adding or editing a book, now with a genre dropdown.

import { useState, useEffect } from 'react';
import { GENRES } from '../utils/constants'; // <-- Import the genres

export default function BookForm({ initialData, onSubmit, onCancel, isLoading }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    publishedYear: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        author: initialData.author || '',
        genre: initialData.genre || '',
        publishedYear: initialData.publishedYear || '',
      });
    } else {
      // Reset form and set a default genre if desired
      setFormData({ title: '', author: '', genre: '', publishedYear: '' });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.genre) {
      alert('Please select a genre.');
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
        <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
      </div>
      <div>
        <label htmlFor="author" className="block text-sm font-medium text-gray-700">Author</label>
        <input type="text" name="author" id="author" value={formData.author} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
      </div>
      <div>
        {/* --- UPDATED GENRE FIELD --- */}
        <label htmlFor="genre" className="block text-sm font-medium text-gray-700">Genre</label>
        <select 
          name="genre" 
          id="genre" 
          value={formData.genre} 
          onChange={handleChange} 
          required 
          className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="" disabled>Select a genre</option>
          {GENRES.map(genre => (
            <option key={genre} value={genre}>{genre}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="publishedYear" className="block text-sm font-medium text-gray-700">Published Year</label>
        <input type="number" name="publishedYear" id="publishedYear" value={formData.publishedYear} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
      </div>
      <div className="flex justify-end space-x-3 pt-2">
        <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300">Cancel</button>
        <button type="submit" disabled={isLoading} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300">
          {isLoading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}
