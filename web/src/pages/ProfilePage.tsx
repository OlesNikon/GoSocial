import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import type { User } from '../types';
import './Profile.css';

export default function ProfilePage() {
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isFollowing, setIsFollowing] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();

    const loadUser = useCallback(async () => {
        if (!id) return;

        try {
            const data = await apiService.getUser(parseInt(id));
            setUser(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load user');
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadUser();
    }, [loadUser]);

    const handleFollow = async () => {
        if (!user || actionLoading) return;

        setActionLoading(true);
        try {
            if (isFollowing) {
                await apiService.unfollowUser(user.id);
                setIsFollowing(false);
            } else {
                await apiService.followUser(user.id);
                setIsFollowing(true);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update follow status');
        } finally {
            setActionLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="profile-container">
                <div className="loading">Loading profile...</div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="profile-container">
                <div className="error-message">{error || 'User not found'}</div>
                <button className="btn btn-primary" onClick={() => navigate('/feed')}>
                    Back to Feed
                </button>
            </div>
        );
    }

    const isOwnProfile = currentUser?.id === user.id;

    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-header">
                    <div className="profile-avatar">
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="profile-info">
                        <h1>{user.username}</h1>
                        <p className="profile-email">{user.email}</p>
                        <div className="profile-badges">
                            <span className={`badge ${user.is_active ? 'active' : 'inactive'}`}>
                                {user.is_active ? '✓ Active' : '⊗ Inactive'}
                            </span>
                            <span className="badge role">{user.role.name}</span>
                        </div>
                    </div>
                </div>

                <div className="profile-meta">
                    <p>
                        <strong>Member since:</strong>{' '}
                        {new Date(user.created_at).toLocaleDateString()}
                    </p>
                    {user.role.description && (
                        <p>
                            <strong>Role:</strong> {user.role.description}
                        </p>
                    )}
                </div>

                {!isOwnProfile && (
                    <div className="profile-actions">
                        <button
                            className={`btn ${isFollowing ? 'btn-secondary' : 'btn-primary'}`}
                            onClick={handleFollow}
                            disabled={actionLoading}
                        >
                            {actionLoading
                                ? 'Loading...'
                                : isFollowing
                                    ? 'Unfollow'
                                    : 'Follow'}
                        </button>
                    </div>
                )}
            </div>

            <button className="btn btn-secondary" onClick={() => navigate('/feed')}>
                Back to Feed
            </button>
        </div>
    );
}
