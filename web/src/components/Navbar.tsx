import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Navbar.css';

export default function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    Social App
                </Link>

                <div className="navbar-menu">
                    {isAuthenticated ? (
                        <>
                            <Link to="/feed" className="navbar-link">
                                Feed
                            </Link>
                            <Link to="/posts/new" className="navbar-link">
                                New Post
                            </Link>
                            {user && (
                                <Link to={`/profile/${user.id}`} className="navbar-link">
                                    Profile
                                </Link>
                            )}
                            <button onClick={handleLogout} className="navbar-button">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="navbar-link">
                                Login
                            </Link>
                            <Link to="/register" className="navbar-link navbar-link-primary">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
