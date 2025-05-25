import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">Laptop Registration</Link>
        <div className="space-x-4">
          <Link to="/" className="text-white hover:text-gray-200">Home</Link>
          {username ? (
            <>
              <Link to={`/profile/${username}`} className="text-white hover:text-gray-200">Profile</Link>
              {username === 'admin' && (
                <Link to="/admin" className="text-white hover:text-gray-200">Admin</Link>
              )}
              <button onClick={handleLogout} className="text-white hover:text-gray-200">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white hover:text-gray-200">Login</Link>
              <Link to="/register" className="text-white hover:text-gray-200">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;