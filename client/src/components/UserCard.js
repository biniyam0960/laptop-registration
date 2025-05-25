function UserCard({ user }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold">{user.name}</h3>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Student ID:</strong> {user.studentId}</p>
      <p><strong>Serial Number:</strong> {user.serialNumber}</p>
      <p><strong>Batch:</strong> {user.batch}</p>
      {user.role && <p><strong>Role:</strong> {user.role}</p>}
    </div>
  );
}

export default UserCard;