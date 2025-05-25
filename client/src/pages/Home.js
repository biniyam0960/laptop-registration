import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserCard from '../components/UserCard';

function Admin() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  useEffect(() => {
    if (username !== 'admin') {
      setMessage('Access denied. Admin only.');
      navigate('/login');
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/users');
        setUsers(response.data);
      } catch (error) {
        setMessage(error.response?.data.message || 'Error fetching users');
      }
    };
    fetchUsers();
  }, [username, navigate]);

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      {message && <p className="mb-4 text-red-600">{message}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <UserCard key={user._id} user={user} />
        ))}
      </div>
    </div>
  );
}

export default Admin;