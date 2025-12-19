import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiService } from '../services/api';
import './Auth.css';

export default function ConfirmationPage() {
    const { token = '' } = useParams<{ token: string }>();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleConfirm = async () => {
        setIsLoading(true);
        setError('');

        try {
            await apiService.activateUser(token);
            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to activate account');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Account Activation</h1>

                {success ? (
                    <div className="success-message">
                        <h2>Account Activated!</h2>
                        <p>Your account has been successfully activated. Redirecting to login...</p>
                    </div>
                ) : (
                    <>
                        <p className="auth-subtitle">
                            Click the button below to activate your account
                        </p>

                        {error && <div className="error-message">{error}</div>}

                        <button
                            onClick={handleConfirm}
                            className="btn btn-primary"
                            disabled={isLoading}
                            style={{ width: '100%' }}
                        >
                            {isLoading ? 'Activating...' : 'Activate Account'}
                        </button>

                        <div className="auth-footer">
                            <p>
                                Already activated? <a href="/login">Sign in</a>
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
