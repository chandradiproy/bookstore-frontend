// The login page component.

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { useLoginMutation } from '../redux/features/api/apiSlice';
import { setCredentials } from '../redux/features/auth/authSlice';
import { jwtDecode } from 'jwt-decode'; // You may need to install this: npm install jwt-decode

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading, isSuccess, isError, error, data }] = useLoginMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // The login mutation hook returns the token in the `data` field
      await login({ email, password }).unwrap();
    } catch (err) {
      // The error is already handled by the isError and error states,
      // but you can log it here if needed.
      console.error('Failed to login:', err);
    }
  };
  
  useEffect(() => {
    if (isSuccess) {
      toast.success('Logged in successfully!');
      const decodedUser = jwtDecode(data.token);
      dispatch(setCredentials({ user: { email: decodedUser.email }, token: data.token }));
      navigate('/');
    }
    if (isError) {
      toast.error(error?.data?.error?.message || 'An error occurred during login.');
    }
  }, [isSuccess, isError, data, error, navigate, dispatch]);

  return (
    <div className="flex justify-center items-center mt-10">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Login to your account</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">Password</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <button type="submit" disabled={isLoading} className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400">
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-center text-sm">
          Don't have an account? <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">Register here</Link>
        </p>
      </div>
    </div>
  );
}
