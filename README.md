Laptop Registration System
Overview
The Laptop Registration System is a full-stack web application that allows students to register their laptops with details such as student ID, serial number, name, batch, username, and password. It includes user authentication (login/register), a profile page, and an admin dashboard to view all registered users. The application is built with a Node.js/Express backend and a React frontend, using MongoDB as the database.
Features

User Registration: Register with student details and credentials.
User Login: Authenticate to access profile.
Profile Page: View user details after login.
Admin Dashboard: View all registered users (accessible only by username: admin).
Responsive Design: Styled with Tailwind CSS for a clean UI.

Project Structure
laptop-registration/
├── client/                   # React frontend
│   ├── public/              # Public assets
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/                 # React source code
│   │   ├── components/      # Reusable components
│   │   │   ├── Navbar.js
│   │   │   └── UserCard.js
│   │   ├── pages/           # Page components
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Profile.js
│   │   │   └── Admin.js
│   │   ├── App.js
│   │   ├── index.js
│   │   ├── App.css
│   │   └── index.css
│   ├── build/               # Generated after npm run build
│   └── package.json
├── server.js                # Express backend
├── package.json             # Backend dependencies
├── .gitignore               # Git ignore file
└── README.md                # Project documentation

Prerequisites

Node.js: Version 18 or higher (tested with v22.14.0).
npm: Ensure it's installed and up-to-date (npm install -g npm).
MongoDB: Running locally on mongodb://localhost:27017.
Operating System: Instructions are tailored for Ubuntu/Linux, but should work on macOS/Windows with minor adjustments.

Setup Instructions
1. Clone the Repository
If you haven't already, clone the repository to your local machine:
git clone <repository-url>
cd laptop-registration

2. Install MongoDB
Ensure MongoDB is installed and running:
sudo apt update
sudo apt install mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb

Verify MongoDB is running:
sudo systemctl status mongodb

3. Backend Setup

Navigate to the root directory:cd /path/to/laptop-registration


Install backend dependencies:npm install


Start the backend server:npm start


The server will run on http://localhost:3000.
You should see logs: MongoDB connected and Server running on port 3000.



4. Frontend Setup

Navigate to the client directory:cd client


Install frontend dependencies:npm install


Build the React application (for production):npm run build


This generates the build folder, which the backend serves.



5. Run the Application

Production Mode:
After building the frontend, the backend serves the app. Access it at http://localhost:3000.


Development Mode:
Run the backend in the root directory:cd /path/to/laptop-registration
npm start


In a separate terminal, run the frontend development server:cd /path/to/laptop-registration/client
npm start


The frontend will open at http://localhost:3000 (or another port if 3000 is occupied, e.g., 3001).



Usage

Register: Go to /register to create a new user account.
Fill in details: student ID, serial number, name, batch, username, and password.


Login: Go to /login to authenticate.
Use the username and password from registration.


Profile: After logging in, visit /profile/:username to view user details.
Admin Dashboard:
Register a user with username: admin.
Log in as admin to access /admin, where you can view all registered users.



API Endpoints

GET /api: Welcome message.
POST /register: Register a new user.
POST /login: Log in a user.
GET /profile/:username: Fetch user profile by username.
GET /users: Fetch all users (for admin).

Notes

Security: The admin page uses a simple username === 'admin' check. For production, implement JWT or role-based authentication.
CORS: The backend allows all CORS requests. Restrict origins in production.
MongoDB: Ensure MongoDB is running before starting the backend.
Directory Name: If your directory is named laptop regstration, consider renaming to laptop-registration for consistency:mv /path/to/laptop\ regstration /path/to/laptop-registration



Troubleshooting

Backend Errors:
If express is missing: npm install express.
If MongoDB fails to connect, ensure it's running (sudo systemctl status mongodb).


Frontend Errors:
If npm run build fails, ensure all files (src/index.js, etc.) are present.
Run npm start in the client directory to catch development errors.


File Not Found: If the backend can't find client/build/index.html, run npm run build in the client directory.

