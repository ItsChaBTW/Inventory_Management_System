# Inventory Management System

A web-based inventory management system built with HTML, CSS, Tailwind CSS, and JavaScript. This application allows users to manage inventory items with CRUD (Create, Read, Update, Delete) operations.

## Features

- **User Authentication**: Sign up and login functionality
- **Inventory Management**: Add, view, edit, and delete inventory items
- **Responsive Design**: Works on desktop and mobile devices
- **Local Storage**: Data is stored in the browser's local storage

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Edge, etc.)
- A local web server (optional, but recommended)

### Installation

1. Clone or download this repository
2. If using a local web server (like XAMPP, WAMP, or Live Server in VS Code), place the files in your server's web directory
3. Open the index.html file in your browser

### Using the Application

1. Start by creating a new account on the sign-up page
2. Log in with your credentials
3. Use the dashboard to manage inventory items:
   - Add new items using the "Add New Item" button
   - View all items in the table
   - Edit items by clicking the "Edit" button
   - Delete items by clicking the "Delete" button

## Project Structure

- **index.html**: Homepage
- **login.html**: Login page
- **signup.html**: Signup page
- **dashboard.html**: Inventory management interface
- **css/**: Contains CSS files
- **js/**: Contains JavaScript files
  - **auth.js**: Authentication functionality
  - **login.js**: Login page functionality
  - **signup.js**: Signup page functionality
  - **inventory.js**: Inventory CRUD operations

## Technologies Used

- HTML5
- CSS3
- Tailwind CSS
- JavaScript (ES6+)
- LocalStorage API

## Notes

- This application uses browser localStorage for data persistence, which means:
  - Data is stored only in the browser where it was created
  - Clearing browser data will delete all inventory information
  - This is a demonstration application and not suitable for production use without a proper backend