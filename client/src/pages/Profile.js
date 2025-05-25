import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Profile() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/profile/${username}`);
        setUser(response.data);
      } catch (error) {
        setMessage(error.response?.data.message || 'Error fetching profile');
      }
    };
    fetchProfile();
  }, [username]);

  if (!user) {
    return <div className="container mx-auto py-10">{message || 'Loading...'}</div>;
  }

  return (
    <div className="container mx-auto max-w-md py-10">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Student ID:</strong> {user.studentId}</p>
        <p><strong>Serial Number:</strong> {user.serialNumber}</p>
        <p><strong>Batch:</strong> {user.batch}</p>
      </div>
      {message && <p className="mt-4 text-red-600">{message}</p>}
    </div>
  );
}

export default Profile;