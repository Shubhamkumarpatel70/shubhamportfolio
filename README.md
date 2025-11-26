# MERN Portfolio Website

A fully responsive portfolio website built with the MERN stack (MongoDB, Express, React, Node.js). Features include authentication, admin dashboard, coffee purchase system, contact form, and a modern, beautiful UI.

## 🚀 Quick Start

### Install Dependencies

```bash
# Install root, backend, and frontend dependencies
npm run install-all
```

### Development

```bash
# Run both backend and frontend concurrently
npm run dev
```

### Production Build

```bash
# Build frontend and prepare for deployment
npm run build

# Start production server
npm start
```

## Features

- 🏠 **Home Page** - Hero section with skills showcase
- 👤 **About Page** - Personal information and experience timeline
- 💼 **Projects Page** - Portfolio of projects with technology tags
- 📧 **Contact Page** - Working contact form with backend integration
- 🔐 **Authentication** - Login and Register pages with JWT authentication
- 📱 **Responsive Design** - Fully responsive on all devices
- 🎨 **Modern UI** - Beautiful gradient designs and smooth animations

## Tech Stack

### Frontend
- React 18
- React Router DOM
- Axios
- Tailwind CSS (Responsive Design with Custom Color Palette)

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (JSON Web Tokens)
- Bcryptjs
- Express Validator

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

4. Start MongoDB (if running locally):
```bash
# On Windows
net start MongoDB

# On Mac/Linux
sudo systemctl start mongod
```

5. Start the backend server:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Project Structure

```
PORTFOLIO MERN/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Contact.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── contact.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js
│   │   │   ├── Header.css
│   │   │   ├── Footer.js
│   │   │   └── Footer.css
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Home.css
│   │   │   ├── About.js
│   │   │   ├── About.css
│   │   │   ├── Projects.js
│   │   │   ├── Projects.css
│   │   │   ├── Contact.js
│   │   │   ├── Contact.css
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   └── Auth.css
│   │   ├── utils/
│   │   │   └── container.css
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Contact
- `POST /api/contact` - Submit contact form

## Usage

1. **Register/Login**: Create an account or login to access authenticated features
2. **View Projects**: Browse through the portfolio projects
3. **Contact**: Fill out the contact form to send messages
4. **Responsive**: The website adapts to all screen sizes

## Customization

- Update personal information in `Home.js`, `About.js`
- Modify projects in `Projects.js`
- Change contact details in `Contact.js`
- Customize colors in `tailwind.config.js`:
  - `bg-dark` (#0D1117) - Background
  - `primary` (#58A6FF) - Primary Color
  - `accent` (#F78166) - Accent Color
  - `text-primary` (#C9D1D9) - Text Color
  - `card-bg` (#161B22) - Card/Section Background
- Modify backend routes and models as needed

## Environment Variables

Make sure to set up your `.env` file in the backend directory with:
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens

## License

This project is open source and available for personal and commercial use.

## Support

For issues or questions, please open an issue on the repository.

