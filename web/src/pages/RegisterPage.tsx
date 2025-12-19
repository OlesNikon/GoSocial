import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Auth.css';

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activationToken, setActivationToken] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await register({ username, email, password });
            setActivationToken(response.token);
            setSuccess(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to register');
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="auth-container">
                <div className="auth-card">
                    <div className="success-message">
                        <h2>Registration Successful!</h2>
                        <p>
                            Please check your email to activate your account. We've sent an activation
                            link to <strong>{email}</strong>.
                        </p>
                        {activationToken && (
                            <div className="activation-info">
                                <p>Your activation token:</p>
                                <code className="token-display">{activationToken}</code>
                                <p className="help-text">
                                    Click the link in your email or use this token manually.
                                </p>
                            </div>
                        )}
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/login')}
                            style={{ marginTop: '1rem' }}
                        >
                            Go to Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Create Account</h1>
                <p className="auth-subtitle">Join our community today</p>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="Choose a username"
                            disabled={isLoading}
                            maxLength={100}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="your@email.com"
                            disabled={isLoading}
                            maxLength={255}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Choose a strong password"
                            disabled={isLoading}
                            minLength={3}
                            maxLength={72}
                        />
                        <small>Minimum 3 characters</small>
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                        {isLoading ? 'Creating account...' : 'Sign Up'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Already have an account? <Link to="/login">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
