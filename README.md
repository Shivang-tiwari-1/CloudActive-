Event Scheduling Web Application – PERN Stack Assignment
Overview

This is a full-stack Event Scheduling Application built as part of the coding assignment.
The application allows users to create, view, and join events while following best coding practices, clean code principles, and modular design.

Tech Stack:

Frontend: React (Tailwind CSS for styling)

Backend: Node.js + Express.js

Database: PostgreSQL running inside Docker

Authentication: JWT (JSON Web Tokens)
Tech Stack:
Frontend: React
Backend: Node.js + Express
Database: Postgres
API Type: REST

Installation & Setup
git clone https://github.com/Shivang-tiwari-1/Assignment.git

Backend setup
cd backend
npm install
npm start

Frontend setup
cd frontend
npm install
npm start

PostgreSQL Setup (Docker Recommended)

This project uses PostgreSQL running in a Docker container for easier setup and isolation.

docker run --name event-db \
 -e POSTGRES_USER=your_user \
 -e POSTGRES_PASSWORD=your_password \
 -e POSTGRES_DB=eventdb \
 -p 5432:5432 \
 -d postgres

Replace your_user and your_password with your desired credentials.
Update the backend .env file with the same credentials to connect successfully.

API Endpoints

Authentication / User

POST /login → Login user (returns access & refresh tokens)

POST /createuser → Register a new user

POST /refreshToken → Get a new access token using refresh token

POST /logout → Logout user (invalidate refresh token, requires JWT)

Events

POST /createEvent → Create a new event (requires JWT)

GET /getAllEvent → Get all events (public or requires JWT)

GET /getEventById → Get details of a single event (requires JWT)

PUT /updateEvent → Update an event (requires JWT, only creator)

DELETE /deleteEvent → Delete an event (requires JWT, only creator)

Event Attendance

POST /joinEvent → Join an event (requires JWT)

POST /leaveEvent → Leave an event (requires JWT)

### Signup Page

![Signup Page](screenShoot\signup.png)
_User enters name, phone, and password to create a new account. Upon successful signup, user is directed to login page_

### Login Page

![Login Page](https://raw.githubusercontent.com/Shivang-tiwari-1/Assignment/main/ScreenShot/loginpage.png)
_User logs in with email and password. If "Remember Me" is checked, the login state is persistent across page refreshes or closing the browser. The app uses a refresh token mechanism to automatically generate a new access token when the old one expires, ensuring the user stays logged in without losing their session._

### Products Page

![Update Page](https://raw.githubusercontent.com/Shivang-tiwari-1/Assignment/main/ScreenShot/productpage.png)
Logged-in users can update their own events. The modal/page allows editing the following fields:

Title – The name of the event (maximum 10 words).

Description – Details about the event.

Date – Event date.

Time – Event start time.

Location – Venue or address of the event.

At least one field must be provided to update the event. Upon submitting, the app triggers the updateEvent API call to save changes. Success or error messages are shown based on the API response.

### Cart Page

![Home Page](https://raw.githubusercontent.com/Shivang-tiwari-1/Assignment/main/ScreenShot/cart.png)
Lists all available events with details such as title, description, date, time, and location. Logged-in users can click on an event to view more details or join/leave the event.
