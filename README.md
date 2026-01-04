# Flutterer 🐦

A Twitter-inspired social media platform built as a final project for Python & JavaScript. This application allows users to view and post short messages ("Floots") using a custom Python backend and a vanilla JavaScript frontend.

## 🚀 Features
* **Full Stack Architecture:** Python HTTP server backend connected to a JavaScript frontend.
* **REST API:** Custom implementation of GET and POST requests built from scratch (no external web frameworks).
* **Dynamic Content:** Updates the feed asynchronously without reloading the page.
* **JSON Data Storage:** Posts are serialized and managed via JSON.

## 🛠️ Prerequisites
Before running the project, ensure you have Python installed.

You also need the `colorama` library for terminal output formatting.
Run this command in your terminal to install it:
   pip install colorama

## 🎮 How to Run

**Do not open the HTML file directly.** This project requires the Python server to be running to handle API requests.

1. **Open your terminal** in the project folder.
2. **Start the server** by running:
   python run_server.py
3. **Open the App:**
   The terminal will verify the server is running. Open your web browser and navigate to:
   
   👉 http://localhost:1066/index.html
   
   (Note: You can usually Ctrl+Click or Cmd+Click this link directly from the terminal output).

## 📂 Project Structure
* `run_server.py`: The main entry point. Sets up the HTTP server and handles routing.
* `api.py`: Defines the endpoints for fetching and posting data.
* `flutterer.js`: Handles frontend logic, DOM manipulation, and fetch API calls.
* `index.html`: The main user interface.
* `style.css`: Styling for the feed and composer.

## ⚠️ Troubleshooting
* **"Failed to fetch" or CORS Errors:**
  If you see network errors in the console, ensure you are accessing the site via `localhost:1066` and **not** by double-clicking the `index.html` file. The browser blocks file-system API requests for security.
* **Port in use:**
  If the server fails to start, make sure you don't have another instance of the terminal already running the server.

---
Created by Yasha Shaw for Final Project Submission.
