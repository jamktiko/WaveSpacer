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

## 📊 Database Schema

The application uses a relational database designed to store users, their Spotify data, listening history, songs, and the relationships between artists and genres.

### **User**
| Field | Type | Description |
|--------|--------|-------------|
| `id` | INT (PK) | Internal user ID |
| `cognito_sub` | VARCHAR(45) | Cognito user identifier |
| `spotify_user_id` | VARCHAR(200) | Spotify user ID |
| `registered_at` | DATE | Registration date |

---

### **User_tokens**
A user can have multiple tokens (access/refresh).

| Field | Type | Description |
|--------|--------|-------------|
| `id` | INT (PK) | Token ID |
| `type` | ENUM | e.g. spotify_access_token / spotify_refresh_token |
| `token` | VARCHAR(1000) | Token value |
| `expires_at` | INT | Unix timestamp |
| `User_id` | INT (FK → User.id) | Owning user |

---

### **Subscription**
Represents a user’s subscription (free or paid).

| Field | Type |
|--------|--------|
| `id` | INT (PK) |
| `plan` | ENUM('free', 'plus') |
| `start_date` | DATE |
| `end_date` | DATE |
| `active` | TINYINT |
| `User_id` | INT (FK → User.id) |

---

### **Song**
Songs the user has listened to.

| Field | Type |
|--------|--------|
| `id` | INT (PK) |
| `spotify_track_id` | VARCHAR(200) |
| `name` | VARCHAR(45) |
| `amount` | INT | How many times the song has been played |
| `User_id` | INT (FK → User.id) |
| `track_image` | VARCHAR(300) |

---

### **Play_history**
Individual listening events.

| Field | Type |
|--------|--------|
| `id` | INT (PK) |
| `played_at` | DATETIME(3) |
| `Song_id` | INT (FK → Song.id) |
| `User_id` | INT (FK → User.id) |

---

### **Artist**
| Field | Type |
|--------|--------|
| `id` | INT (PK) |
| `name` | VARCHAR(45) |

---

### **Genre**
| Field | Type |
|--------|--------|
| `id` | INT (PK) |
| `name` | VARCHAR(45) |

---

### **Artist_Song** (Many-to-Many)
| Field | Type |
|--------|--------|
| `Artist_id` | INT (FK → Artist.id) |
| `Song_id` | INT (FK → Song.id) |

---

### **Genre_Artist** (Many-to-Many)
| Field | Type |
|--------|--------|
| `Genre_id` | INT (FK → Genre.id) |
| `Artist_id` | INT (FK → Artist.id) |

---

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
