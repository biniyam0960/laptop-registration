import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserCard from '../components/UserCard';

function Admin() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [editUser, setEditUser] = useState(null);
  const [newUser, setNewUser] = useState({
    studentId: '',
    serialNumber: '',
    name: '',
    batch: '',
    username: '',
    password: '',
    role: 'user'
  });
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  useEffect(() => {
    if (!username || username !== 'admin') {
      setMessage('Access denied. Admin only.');
      navigate('/login');
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await axios.get('/users', {
          headers: { 'Content-Type': 'application/json' }
        });
        setUsers(response.data);
      } catch (error) {
        setMessage(error.response?.data?.message || 'Error fetching users');
      }
    };
    fetchUsers();
  }, [username, navigate]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`/users/${id}`, {
          headers: { 'Content-Type': 'application/json' }
        });
        setUsers(users.filter(user => user._id !== id));
        setMessage('User deleted successfully');
      } catch (error) {
        setMessage(error.response?.data?.message || 'Error deleting user');
      }
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/users/${editUser._id}`, {
        ...editUser,
        password: editUser.password || undefined
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      setUsers(users.map(u => u._id === editUser._id ? { ...response.data.user, password: undefined } : u));
      setEditUser(null);
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error updating user');
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/admin/add', newUser, {
        headers: { 'Content-Type': 'application/json' }
      });
      setUsers([...users, { ...newUser, _id: response.data._id, password: undefined }]);
      setNewUser({ studentId: '', serialNumber: '', name: '', batch: '', username: '', password: '', role: 'user' });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error adding user');
    }
  };

  if (message && message.includes('Access denied')) {
    return <div className="container mx-auto py-10">{message}</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      {message && !message.includes('Access denied') && <p className="mb-4 text-green-600">{message}</p>}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Add New User</h3>
        <form onSubmit={handleAddUser} className="bg-white p-4 rounded-lg shadow-md">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Student ID"
              value={newUser.studentId}
              onChange={(e) => setNewUser({ ...newUser, studentId: e.target.value })}
              className="p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Serial Number"
              value={newUser.serialNumber}
              onChange={(e) => setNewUser({ ...newUser, serialNumber: e.target.value })}
              className="p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Batch"
              value={newUser.batch}
              onChange={(e) => setNewUser({ ...newUser, batch: e.target.value })}
              className="p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Username"
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              className="p-2 border rounded"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              className="p-2 border rounded"
              required
            />
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className="p-2 border rounded"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 col-span-2">
              Add User
            </button>
          </div>
        </form>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <div key={user._id} className="relative">
            <UserCard user={user} />
            <div className="mt-2 flex space-x-2">
              <button
                onClick={() => handleEdit(user)}
                className="bg-yellow-500 text-white p-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(user._id)}
                className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
            {editUser && editUser._id === user._id && (
              <form onSubmit={handleSaveEdit} className="mt-2 bg-white p-4 rounded-lg shadow-md">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Student ID"
                    value={editUser.studentId}
                    onChange={(e) => setEditUser({ ...editUser, studentId: e.target.value })}
                    className="p-1 border rounded"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Serial Number"
                    value={editUser.serialNumber}
                    onChange={(e) => setEditUser({ ...editUser, serialNumber: e.target.value })}
                    className="p-1 border rounded"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Name"
                    value={editUser.name}
                    onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                    className="p-1 border rounded"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Batch"
                    value={editUser.batch}
                    onChange={(e) => setEditUser({ ...editUser, batch: e.target.value })}
                    className="p-1 border rounded"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Username"
                    value={editUser.username}
                    onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
                    className="p-1 border rounded"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password (leave blank to keep unchanged)"
                    value={editUser.password || ''}
                    onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
                    className="p-1 border rounded"
                  />
                </div>
                <div className="mt-2 flex space-x-2">
                  <button type="submit" className="bg-blue-600 text-white p-1 rounded hover:bg-blue-700">
                    Save
                  </button>
                  <button
                    onClick={() => setEditUser(null)}
                    className="bg-gray-500 text-white p-1 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Admin;