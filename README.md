# Library Management System

A complete, production-ready Library Management System built with React and TailwindCSS, featuring separate dashboards for administrators and students.

## Features

### Admin Features
- **Dashboard**: Overview with statistics and charts showing total books, issued books, returned books, and registered students
- **Books Management**: Add, edit, delete, and search books with detailed information (title, author, category, ISBN, quantity)
- **Issue Books**: Issue books to students with automatic due date calculation (7 days)
- **Returns Management**: Process book returns with automatic fine calculation (₹5 per day for late returns)
- **Student Management**: Add, edit, and delete student records

### Student Features
- **Personal Dashboard**: View issued books, return history, and library statistics
- **Browse Books**: Search and filter books by category and availability
- **Fine Tracking**: Automatic calculation of overdue fines

## Technologies Used
- **Frontend**: React 18, TailwindCSS
- **Icons**: Lucide Icons
- **Charts**: Chart.js
- **Database**: Trickle Database (built-in)
- **Authentication**: Local Storage based auth system

## Login Credentials

### Admin
- Email: `admin@library.com`
- Password: `admin123`

### Student (Demo)
- Email: `student@demo.com`
- Password: `student123`

## Project Structure
```
├── index.html                 # Login page
├── admin-dashboard.html       # Admin dashboard
├── books.html                 # Books management
├── issue-book.html           # Issue books page
├── returns.html              # Returns management
├── students.html             # Students management
├── student-dashboard.html    # Student dashboard
├── browse-books.html         # Browse books (student)
├── app.js                    # Login logic
├── admin-dashboard-app.js    # Admin dashboard logic
├── books-app.js              # Books management logic
├── issue-book-app.js         # Issue book logic
├── returns-app.js            # Returns logic
├── students-app.js           # Students management logic
├── student-dashboard-app.js  # Student dashboard logic
├── browse-books-app.js       # Browse books logic
├── utils/
│   └── auth.js              # Authentication utilities
└── components/
    ├── Toast.js             # Toast notifications
    ├── ThemeToggle.js       # Dark/Light mode toggle
    ├── AdminHeader.js       # Admin navigation header
    ├── StudentHeader.js     # Student navigation header
    ├── StatsCard.js         # Statistics display card
    ├── CategoryChart.js     # Category distribution chart
    └── Modal.js             # Reusable modal component
```

## Database Schema

### Book Table
- Title (text)
- Author (text)
- Category (text with options)
- ISBN (text)
- Quantity (number)
- Available (number)

### Student Table
- Name (text)
- Email (text)
- Password (text)
- RollNumber (text)
- Department (text with options)

### Issue Table
- BookId (text reference)
- StudentId (text reference)
- BookTitle (text)
- StudentName (text)
- IssueDate (datetime)
- DueDate (datetime)
- ReturnDate (datetime)
- Fine (number)
- Status (Issued/Returned)

## Features Highlights

### Fine Calculation System
- Automatic calculation based on due date
- ₹5 per day for late returns
- Real-time fine display on both admin and student dashboards

### Dark/Light Mode
- Toggle between themes
- Persistent theme selection
- Smooth transitions

### Search & Filter
- Search books by title or author
- Filter books by category
- Real-time filtering

### Responsive Design
- Mobile-friendly interface
- Grid layouts for different screen sizes
- Adaptive navigation

## How to Use

### Admin Workflow
1. Login with admin credentials
2. View dashboard statistics and charts
3. Add books to the library
4. Register students
5. Issue books to students
6. Process returns and collect fines

### Student Workflow
1. Login with student credentials
2. View personal dashboard
3. Browse available books
4. Check issued books and due dates
5. Monitor any overdue fines

## Development Notes
- All data persists in Trickle Database
- No backend setup required
- Production-ready code
- SEO optimized
- Accessibility features included

## Copyright
© 2025 Library Management System. All rights reserved.