
# Artworks Gallery

A full-stack web app for browsing, saving, creating, and editing artworks!  
Built with **React**, **Node.js**, **Express**, and **MongoDB**.

---

## Installation

Follow these steps to set up the project locally:

1. **Clone the Repository**

   ```bash
   git clone https://github.com/adamoshea/artworks-web-app.git
   cd artworks-web-app
   ```

2. **Install Backend Dependencies**

   From the artworks-web-app directory:
   ```bash
   npm install
   ```

3. **Install Frontend Dependencies**

   Open a second terminal window:

   ```bash
   cd client
   npm install
   ```

---

## Running the App

**Start the Backend (API Server)**
In one terminal:

```bash
npm start
```
> Starts on **http://localhost:3001** by default.

---

**Start the Frontend (React App)**
In another terminal:

```bash
cd client
npm start
```
> Opens automatically at **http://localhost:3000**

---

## Technologies Used

- **React** — Component-based frontend framework
- **Node.js & Express** — Lightweight server and API routing
- **MongoDB Memory Server** — Temporary, in-memory database for fast development
- **Axios** — Frontend HTTP client for API communication
- **Inline CSS** — Simple styling built into components
- **FontAwesome Icons (react-icons)** — Visual enhancement with beautiful icons

---

## Features

- Register and login functionality
- Save and unsave favorite artworks
- Create, edit, and delete artworks
- Search and sort artworks
- Clean responsive UI with modals for Create/Edit
- Toast notifications for important actions
- Automatic frontend refresh on saving, editing, or deleting artworks

---
