# Library Management System (LMS)

This project is a Library Management System developed using Django REST Framework for the backend and ReactJS for the frontend.

## Overview

Library Management System project, built with React.js and Django Rest Framework. This comprehensive system leverages JWT-based authentication (access and refresh tokens) and CORS scripts to ensure secure and seamless library management. Axios is utilized for efficient request and response handling, while Swal (SweetAlert) and React-Toastify enhance the user experience by managing notifications for errors, warnings, and success messages.

## Project Overview

Imagine you are the administrator or in charge of a library. Your responsibilities include:

- Managing book categories and their quantities.
- Keeping track of borrowed books and ensuring timely returns, with a default return period of 30 days.
- Implementing a fine system based on membership plans (Student, Normal, Premium), each with specific borrowing limits (e.g., Students: 10 books/month, Normal: 5 books/month, Premium: 8 books/month).

With this system, you can manage your library better and more effortlessly.

### Key Features

- **Category Management:** CRUD operations for book categories, enabling easy updates and new arrivals.
- **Book Management:** CRUD operations for books, facilitating efficient tracking of new additions and updates.
- **Member Management:** CRUD operations for member information, ensuring accurate records.
- **Borrow and Return Management:** CRUD operations for borrowing and returning books, with fine and limit management.
- **Member Status Management:** Tracks member activity status and outstanding fines, ensuring smooth operations.

### Technical Highlights

- **Authentication:** Secure JWT-based authentication for access and refresh tokens.
- **Frontend:** Built with React.js, styled with Bootstrap and styled-components, and responsive across small, medium, and large screens.
- **Backend:** Powered by Django RestFramework, providing robust and scalable backend services.
- **UX/UI Enhancements:** Axios for seamless request/response handling, Swal (SweetAlert) for user-friendly alerts, and React-Toastify for informative toast notifications.

## Setup

To run this project locally, you will need to set up both the backend and frontend components.

- [Backend Setup](./backend/README.md)
- [Frontend Setup](./frontend/README.md)

