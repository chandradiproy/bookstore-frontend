// The core of our data fetching logic using RTK Query.

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'; // Fallback to localhost if env variable is not set
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: baseUrl, // Your backend URL
    prepareHeaders: (headers, { getState }) => {
      // Get the token from the auth slice
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Book'], // Used for caching and invalidation
  endpoints: (builder) => ({
    // Auth endpoints
    register: builder.mutation({
      query: (credentials) => ({
        url: '/auth/register',
        method: 'POST',
        body: credentials,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    // Book endpoints
    getBooks: builder.query({
      query: ({ genre = '', page = 1, limit = 10 }) => {
        const params = new URLSearchParams({ page, limit });
        if (genre) {
          params.append('genre', genre);
        }
        return `/books?${params.toString()}`;
      },
      // Corrected 'result.data' to 'result.books' to match the API response
      providesTags: (result) => 
        result && result.books
          ? [
              ...result.books.map(({ id }) => ({ type: 'Book', id })),
              { type: 'Book', id: 'LIST' },
            ]
          : [{ type: 'Book', id: 'LIST' }],
    }),
    addBook: builder.mutation({
      query: (newBook) => ({
        url: '/books',
        method: 'POST',
        body: newBook,
      }),
      invalidatesTags: [{ type: 'Book', id: 'LIST' }],
    }),
    updateBook: builder.mutation({
      query: ({ id, ...updatedBook }) => ({
        url: `/books/${id}`,
        method: 'PUT',
        body: updatedBook,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Book', id }, { type: 'Book', id: 'LIST' }],
    }),
    deleteBook: builder.mutation({
      query: (id) => ({
        url: `/books/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Book', id: 'LIST' }],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useRegisterMutation,
  useLoginMutation,
  useGetBooksQuery,
  useAddBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
} = apiSlice;
