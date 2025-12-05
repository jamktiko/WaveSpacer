Wavespacer
==========

An application that lets you remove unwanted songs from your playlist. Log in with your Spotify account and get started.

## Features
- View your most listened-to genres
- Spotify OAuth login
- View your most played song from the last month
- Playlist cleaner that suggests tracks for deletion
- User profile & settings page
- Light mode support

Notice
---------

This was a student project built for a course. The AWS environment that powers the backend will be shut down, and the Spotify API only allows access to approved users. Because of this, the live application **cannot be tested or used** unless you set up your own Spotify credentials and backend.

Running Wavespacer Locally
=============================

To run this project on your own machine, you must create your own backend environment, including both:

*   A Spotify Developer application
    
*   A database (local or hosted)
    

1 Create Environment Variables
--------------------------------

Inside /backend folder, create a .env file.

### Backend .env should include:

```
NODE_ENV
SPOTIFY_CLIENT_ID  
SPOTIFY_CLIENT_SECRET
JWT_SECRET
DB_HOST
DB_USER
DB_PASS
DB_NAME
PORT
FRONTEND_URL
ENCRYPTION_KEY
```

2 Install and Run the Backend
===============================

```
cd backend
npm install
npm start
```

3 Install and Run the Frontend
================================

```
cd frontend
npm install
npm run frontend
```

Testing the App
==================

Once both servers are running:

1.  Open the frontend in your browser
    
2.  Log in with your Spotify Developer test account
    
3.  Begin removing tracks from your playlist
    

Note: The app only works with Spotify users you have added to your Spotify Developer app.

Tech Stack
=============

**Frontend**: Angular + TailwindCSS

**Backend**: Node.js + Express

**Database**: MySQL

**API**: Spotify Web API

Additional Notes
===================

*   Spotify's API requires whitelisting users for development apps.
    
*   This project was originally deployed on AWS (EC2, RDS) but that infrastructure is now offline.
