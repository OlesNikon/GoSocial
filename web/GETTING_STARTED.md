# Getting Started with the Social App Web Frontend

## Quick Start Guide

### 1. Navigate to the web directory
```bash
cd web
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env` file in the web directory:
```bash
cp .env.example .env
```

Or create it manually with:
```env
VITE_API_URL=http://localhost:8080/v1
```

### 4. Start the development server
```bash
npm run dev
```

The frontend will be available at: **http://localhost:5173**

## Backend Requirements

Make sure your Go backend is running on port 8080. You can start it with:

```bash
# From the project root
make run
# or
go run cmd/api/main.go
```

## Features Overview

### 🔐 Authentication
- Register new users with email verification
- Login with JWT tokens
- Protected routes requiring authentication
- Account activation via email

### 📝 Posts
- Create posts with title, content, and tags
- View all posts in a feed
- View individual post details with comments
- Edit and delete your own posts
- Search and filter posts

### 👥 Social Features
- View user profiles
- Follow/unfollow users
- See follower counts

### 🎨 UI/UX
- Responsive design for mobile, tablet, and desktop
- Modern gradient theme
- Smooth animations and transitions
- Loading states and error handling

## Project Structure

```
web/src/
├── components/          # Reusable components
│   ├── Layout.tsx       # Main layout wrapper
│   ├── Navbar.tsx       # Navigation bar
│   └── ProtectedRoute.tsx  # Route authentication guard
├── context/            # React context providers
│   └── AuthContext.tsx # Authentication state management
├── hooks/              # Custom React hooks
│   └── useAuth.ts      # Hook for accessing auth context
├── pages/              # Page components (routes)
│   ├── HomePage.tsx    # Landing page
│   ├── LoginPage.tsx   # Login form
│   ├── RegisterPage.tsx # Registration form
│   ├── FeedPage.tsx    # Posts feed with search/filter
│   ├── CreatePostPage.tsx # Create new post
│   ├── PostDetailPage.tsx # View single post
│   └── ProfilePage.tsx # User profile
├── services/           # API integration
│   └── api.ts          # API client with all endpoints
├── types/              # TypeScript type definitions
│   └── index.ts        # Shared types
├── App.tsx             # Main app with routing
├── main.tsx            # Application entry point
└── config.ts           # Configuration
```

## Common Tasks

### Create a new user account
1. Go to http://localhost:5173
2. Click "Sign Up" or navigate to `/register`
3. Fill in username, email, and password
4. Check your email for the activation token
5. Click the activation link or go to `/confirm/{token}`
6. Login with your credentials

### Create a post
1. Login to your account
2. Click "Create Post" in the navigation
3. Enter title, content, and optionally tags
4. Click "Create Post"

### View your feed
1. Login to your account
2. Navigate to `/feed`
3. Use search and filter options to find specific posts

## API Endpoints Used

The frontend communicates with these backend endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/authentication/user` | POST | Register new user |
| `/authentication/token` | POST | Login (get JWT token) |
| `/users/activate/:token` | PUT | Activate user account |
| `/users/feed` | GET | Get posts feed |
| `/users/:id` | GET | Get user profile |
| `/users/:id/follow` | PUT | Follow user |
| `/users/:id/unfollow` | PUT | Unfollow user |
| `/posts` | POST | Create new post |
| `/posts/:id` | GET | Get post by ID |
| `/posts/:id` | PATCH | Update post |
| `/posts/:id` | DELETE | Delete post |

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:8080/v1` |

### CORS Configuration

Make sure your backend allows requests from the frontend origin. The backend should have:
```go
AllowedOrigins: []string{"http://localhost:5173"}
```

## Troubleshooting

### Frontend doesn't connect to backend
- Check that the backend is running on http://localhost:8080
- Verify `VITE_API_URL` in your `.env` file
- Check browser console for CORS errors

### Authentication not working
- Clear localStorage: Open DevTools → Application → Local Storage → Clear All
- Make sure you activated your account via email
- Check that JWT token is being sent in Authorization header

### Posts not loading
- Verify you're logged in (check localStorage for 'token')
- Check Network tab in DevTools for API errors
- Ensure backend database is running

### Build errors
- Delete `node_modules` and `package-lock.json`, then run `npm install` again
- Make sure you're using Node.js 18 or higher

## Development Tips

### Hot Module Replacement (HMR)
The Vite dev server supports HMR - your changes will be reflected immediately without full page reloads.

### TypeScript
All components use TypeScript for type safety. The API types are defined in `src/types/index.ts`.

### Styling
Each component/page has its own CSS file. Global styles are in `App.css` and `index.css`.

### API Service
All API calls go through `src/services/api.ts`. Add new endpoints there when needed.

## Building for Production

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

To preview the production build locally:
```bash
npm run preview
```

## Next Steps

1. ✅ Set up authentication
2. ✅ Create and view posts
3. ✅ Follow users and build your feed
4. 🔜 Add comments functionality
5. 🔜 Add real-time notifications
6. 🔜 Add image uploads
7. 🔜 Add user settings page

## Support

For issues or questions:
1. Check the backend API logs
2. Check browser DevTools console
3. Verify environment variables
4. Ensure all dependencies are installed
