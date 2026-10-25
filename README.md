# JobTrack – Job Application Tracker

JobTrack is a web application that helps users organize and track their job applications in one place. It provides a dashboard to monitor application progress, manage interviews, and view application statistics.

## Features

- **Dashboard:** View job application statistics and summaries.
- **Application Management:** Add, view, update, and delete job applications.
- **Application Status:** Track applications through different stages, such as Applied, Interview, Offered, and Rejected.
- **Interview Tracking:** Manage interview details and schedules.
- **Analytics:** View application statistics and progress.
- **Search and Filtering:** Find applications more easily.
- **Responsive UI:** Use the application on different screen sizes.
- **Database Integration:** Store application data using MongoDB.

## Tech Stack

**Frontend**
- React
- Vite
- HTML
- CSS
- JavaScript
- Lucide React

**Backend**
- Node.js
- Express.js
- REST API

**Database**
- MongoDB
- Mongoose

**Tools**
- Git
- GitHub
- Visual Studio Code

## Project Structure

```text
jobtrack-complete/
├── models/
├── routes/
├── src/
│   ├── components/
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── .env                 # Create locally; do not commit
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
└── server.cjs
```

## Prerequisites

Install the following before running the project:

- [Node.js](https://nodejs.org/)
- npm (included with Node.js)
- A MongoDB Atlas account or another MongoDB instance
- Git

## Installation and Setup

### 1. Clone the repository

Replace the URL below with the actual URL of this GitHub repository.

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd jobtrack-complete
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root directory and add:

```env
MONGODB_URI=your_own_mongodb_connection_string
PORT=5000
FRONTEND_URL=http://localhost:5173
```

Replace `your_own_mongodb_connection_string` with your own MongoDB connection string. Configure your MongoDB database user and network access in MongoDB Atlas.

**Important:** Never upload your `.env` file or expose your database password on GitHub.

### 4. Start the backend server

Open a terminal in the project folder and run:

```bash
npm run server
```

The backend runs at:

```text
http://localhost:5000
```

Check the API health endpoint:

```text
http://localhost:5000/api/health
```

### 5. Start the frontend

Open a second terminal in the same project folder and run:

```bash
npm run dev
```

Open the local URL displayed by Vite, usually:

```text
http://localhost:5173
```

### 6. Build for production

To create the production frontend build, run:

```bash
npm run build
```

The generated frontend files will be placed in the `dist` directory.

## Environment Configuration

Each developer should configure their own local `.env` file and MongoDB connection string. The repository does not include private database credentials.

For a deployed version, configure environment variables in the hosting provider and set the frontend API URL to the deployed backend URL.

## Future Improvements

- User authentication and individual user accounts
- Personalized job application tracking
- Interview reminders and notifications
- Additional analytics and reporting
- Cloud deployment

## Author

**Sowmiya**

- GitHub: [Sowmiya18228](https://github.com/Sowmiya18228)

---

*JobTrack is a full-stack job application tracking platform designed to help users manage applications, monitor hiring progress, and organize interview details in one place.*
