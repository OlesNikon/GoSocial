import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Home.css';

export default function HomePage() {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return (
            <div className="home-container">
                <div className="home-content">
                    <h1>Welcome Back!</h1>
                    <p>Check out your feed to see the latest posts.</p>
                    <Link to="/feed" className="btn btn-primary">
                        Go to Feed
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="home-container">
            <div className="home-hero">
                <h1>Welcome to Social App</h1>
                <p className="hero-subtitle">
                    Connect, share, and engage with a community of like-minded individuals
                </p>

                <div className="hero-features">
                    <div className="feature">
                        <h3>📝 Share Your Thoughts</h3>
                        <p>Create posts and share your ideas with the community</p>
                    </div>
                    <div className="feature">
                        <h3>👥 Connect with Others</h3>
                        <p>Follow users and stay updated with their content</p>
                    </div>
                    <div className="feature">
                        <h3>💬 Engage</h3>
                        <p>Comment and interact with posts from the community</p>
                    </div>
                </div>

                <div className="hero-actions">
                    <Link to="/register" className="btn btn-primary btn-lg">
                        Get Started
                    </Link>
                    <Link to="/login" className="btn btn-secondary btn-lg">
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
}
