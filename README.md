
# Student Dashboard (React + Vite)

This is a **Student Dashboard** built with **React** and **Vite**. It allows users to manage students, view a list, and add/edit their information, with real-time data synced from **Firebase Firestore**.

## Features:
- **Firebase Authentication** with Google Sign-In.
- **Firestore Integration** for storing and managing student data (name, email, course).
- **Dynamic CRUD operations** for student records (Create, Read, Update, Delete).
- Responsive UI using **Tailwind CSS**.
- **Real-time updates** to the student list as data changes.

## Project Setup

To get started, follow these steps:

### 1. Clone the Repository

First, clone the repository to your local machine:

```bash
git clone https://github.com/your-username/student-dashboard.git
```

### 2. Install Dependencies

Navigate to the project folder and install the required dependencies using npm or yarn:

```bash
cd student-dashboard
npm install
# OR
yarn install
```

### 3. Configure Firebase

Create a `.env` file in the root directory of your project and add your Firebase credentials. This file should **NOT** be pushed to version control (it's ignored by `.gitignore`).

Here's an example of what to add to `.env`:

```bash
VITE_API_KEY=your-firebase-api-key
VITE_AUTH_DOMAIN=your-firebase-auth-domain
VITE_PROJECT_ID=your-firebase-project-id
VITE_STORAGE_BUCKET=your-firebase-storage-bucket
VITE_MESSAGING_SENDER_ID=your-firebase-sender-id
VITE_APP_ID=your-firebase-app-id
VITE_MEASUREMENT_ID=your-firebase-measurement-id
```

### 4. Start the Development Server

After setting up the `.env` file and installing dependencies, run the following command to start the development server:

```bash
npm run dev
# OR
yarn dev
```

This will start the Vite development server, and you can access the project in your browser at `http://localhost:5173`.

---

## How It Works

- **Firebase Authentication**: 
  - Google Authentication is integrated for user login. Users can sign in using their Google account.

- **Firestore Integration**:
  - The student data (name, email, course) is stored in **Firebase Firestore**. Students can be added, edited, or deleted from the Firestore database.

- **Real-time Data Sync**:
  - Any updates to the student data will be immediately reflected in the UI without needing a page refresh, thanks to Firebase Firestore's real-time data synchronization.

---

## Available Commands

In addition to `npm run dev` (or `yarn dev`), here are some useful commands:

- **Build for production**:

  ```bash
  npm run build
  # OR
  yarn build
  ```

- **Preview the production build**:

  ```bash
  npm run preview
  # OR
  yarn preview
  ```

---

### Troubleshooting

1. **Missing `.env` file**: Ensure that you have created the `.env` file in the root directory and added your Firebase credentials.
2. **Dependencies not installed**: Make sure you have installed all the dependencies by running `npm install` or `yarn install` before starting the development server.

---

This template is ready to deploy to any platform supporting static sites like **Vercel**, **Netlify**, or **Firebase Hosting**.
