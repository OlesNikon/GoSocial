import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FeedPage from './pages/FeedPage';
import CreatePostPage from './pages/CreatePostPage';
import PostDetailPage from './pages/PostDetailPage';
import ProfilePage from './pages/ProfilePage';
import ConfirmationPage from './pages/ConfirmationPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/confirm/:token" element={<ConfirmationPage />} />

            <Route
              path="/feed"
              element={
                <ProtectedRoute>
                  <FeedPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/posts/new"
              element={
                <ProtectedRoute>
                  <CreatePostPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/posts/:id"
              element={
                <ProtectedRoute>
                  <PostDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/:id"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
