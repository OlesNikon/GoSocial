# Social App Frontend

A modern React + TypeScript frontend for the Social API backend.

## Features

### Authentication
- **User Registration**: Create a new account with username, email, and password
- **Email Activation**: Activate accounts via email confirmation
- **Login**: Secure JWT-based authentication
- **Protected Routes**: Automatic redirection for unauthenticated users

### Social Features
- **Feed**: Browse posts from the community
- **Create Posts**: Share your thoughts with title, content, and tags
- **View Posts**: Read full posts with comments
- **User Profiles**: View user information and follow/unfollow
- **Search & Filter**: Search posts and sort by date

### UI/UX
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern Styling**: Beautiful gradient themes and smooth animations
- **Loading States**: Clear feedback for async operations
- **Error Handling**: User-friendly error messages

## Tech Stack

- **React 19**: UI library
- **TypeScript**: Type-safe development
- **React Router**: Client-side routing
- **Vite**: Fast build tool and dev server
- **CSS3**: Modern styling with flexbox and grid

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running (default: http://localhost:8080)

### Installation

```bash
cd web
npm install
```

### Configuration

Create a `.env` file in the `web` directory:

```env
VITE_API_URL=http://localhost:8080/v1
```

### Development

Run the development server:

```bash
npm run dev
```

The app will be available at http://localhost:5173

### Build

Create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
web/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Layout.tsx       # App layout with navbar
│   │   ├── Navbar.tsx       # Navigation bar
│   │   └── ProtectedRoute.tsx  # Auth guard
│   ├── context/            # React contexts
│   │   └── AuthContext.tsx # Authentication state
│   ├── pages/              # Page components
│   │   ├── HomePage.tsx    # Landing page
│   │   ├── LoginPage.tsx   # Login form
│   │   ├── RegisterPage.tsx # Registration form
│   │   ├── FeedPage.tsx    # Posts feed
│   │   ├── CreatePostPage.tsx # Create new post
│   │   ├── PostDetailPage.tsx # View single post
│   │   └── ProfilePage.tsx # User profile
│   ├── services/           # API services
│   │   └── api.ts          # API client
│   ├── types/              # TypeScript types
│   │   └── index.ts        # Type definitions
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # App entry point
│   └── config.ts           # Configuration
└── package.json
```

## API Integration

The frontend integrates with the following backend endpoints:

### Authentication
- `POST /authentication/user` - Register new user
- `POST /authentication/token` - Login
- `PUT /users/activate/:token` - Activate account

### Posts
- `GET /users/feed` - Get user feed
- `POST /posts` - Create post
- `GET /posts/:id` - Get post by ID
- `PATCH /posts/:id` - Update post
- `DELETE /posts/:id` - Delete post

### Users
- `GET /users/:id` - Get user profile
- `PUT /users/:id/follow` - Follow user
- `PUT /users/:id/unfollow` - Unfollow user

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:8080/v1` |

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow the existing code style
2. Write meaningful commit messages
3. Test your changes thoroughly
4. Update documentation as needed

## License

This project is part of the Social API application.
