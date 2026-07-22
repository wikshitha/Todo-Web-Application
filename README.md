# 📝 Todo Web Application

A modern full-stack Todo Web Application built with **Next.js**, **Laravel 13**, and **PostgreSQL**. The application provides secure authentication and complete task management with search, filtering, sorting, pagination, and a responsive user interface.

---

# ✨ Features

## 🔐 Authentication

- User Registration
- User Login
- Secure Logout
- Laravel Sanctum Authentication
- Password Hashing
- Protected Routes
- Session-based Authentication using HttpOnly Cookies

---

## ✅ Todo Management

- Create Todo
- Update Todo
- Delete Todo
- View Todo List
- Change Todo Status
  - Todo
  - Pending
  - Completed

---

## 🔍 Search & Filtering

- Search Todos by Title
- Filter by Status
- Sort by
  - Created Date
  - Updated Date
  - Due Date
  - Title
  - Status
- Ascending & Descending Sorting

---

## 📄 Pagination

- Server-side Pagination
- Previous / Next Navigation
- Page Numbers
- Loading State while Changing Pages

---

## 📊 Dashboard

- Total Todos
- Todo Count
- Pending Count
- Completed Count
- Overdue Count

---

## 🎨 User Experience

- Responsive Design
- Skeleton Loading
- Empty States
- Error Handling
- Success Notifications
- Confirmation Dialogs
- Loading Indicators

---

# 🛠 Tech Stack

## Frontend

- Next.js 15 (App Router)
- React
- TypeScript
- Tailwind CSS
- TanStack Query
- Axios
- React Hook Form
- Sonner

---

## Backend

- Laravel 13
- PHP 8.5
- PostgreSQL
- Laravel Sanctum
- Eloquent ORM
- API Resources
- Form Requests
- Policies

---

# 📂 Project Structure

```
Todo-Web-Application
│
├── backend
│   ├── app
│   ├── routes
│   ├── database
│   ├── tests
│   └── ...
│
├── frontend
│   ├── app
│   ├── components
│   ├── context
│   ├── services
│   ├── lib
│   ├── hooks
│   └── ...
│
└── README.md
```

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/wikshitha/Todo-Web-Application.git

cd todo-web-application
```

---

# ⚙️ Backend Setup

Go to backend

```bash
cd backend
```

Install dependencies

```bash
composer install
```

Copy environment file

```bash
cp .env.example .env
```

Generate application key

```bash
php artisan key:generate
```

Configure your PostgreSQL database inside `.env`

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=todo_app
DB_USERNAME=postgres
DB_PASSWORD=your_password
```

Run migrations

```bash
php artisan migrate
```

Start backend server

```bash
php artisan serve
```

Backend URL

```text
http://localhost:8000
```

---

# 💻 Frontend Setup

Go to frontend

```bash
cd frontend
```

Install dependencies

```bash
npm install
```

Create

```
.env.local
```

Add

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Run development server

```bash
npm run dev
```

Frontend URL

```text
http://localhost:3000
```

---

# 🧪 Running Tests

Backend

```bash
php artisan test
```

Frontend

```bash
npm run lint

npm run build
```

---

# 🔑 Authentication Flow

1. Register a new account
2. Login
3. Laravel Sanctum creates a secure HttpOnly session
4. Protected API routes become accessible
5. Logout destroys the authenticated session

---

# 📚 API Overview

## Authentication

| Method | Endpoint |
|----------|------------------|
| POST | /api/register |
| POST | /api/login |
| GET | /api/user |
| POST | /api/logout |

---

## Todos

| Method | Endpoint |
|----------|----------------|
| GET | /api/todos |
| POST | /api/todos |
| GET | /api/todos/{id} |
| PUT | /api/todos/{id} |
| DELETE | /api/todos/{id} |
| GET | /api/todos/stats |

---

# 🔒 Security

- Password Hashing
- CSRF Protection
- Laravel Sanctum Authentication
- Protected API Routes
- Authorization Policies
- Form Request Validation
- HttpOnly Cookies

---

# 📈 Future Improvements

- Dark Mode
- Email Verification
- Password Reset
- Due Date Notifications
- File Attachments
- Activity Logs

---

# 👨‍💻 Author

**Wikshitha Umindu**

- GitHub: https://github.com/wikshitha
- LinkedIn: https://www.linkedin.com/in/wikshitha

---

# 📄 License

This project is created for learning  purpose.
