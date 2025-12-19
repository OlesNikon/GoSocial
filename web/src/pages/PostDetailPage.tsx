import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import type { Post } from '../types';
import './Post.css';

export default function PostDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [post, setPost] = useState<Post | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    const loadPost = useCallback(async () => {
        if (!id) return;

        try {
            const data = await apiService.getPost(parseInt(id));
            setPost(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load post');
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadPost();
    }, [loadPost]);

    const handleDelete = async () => {
        if (!post || !window.confirm('Are you sure you want to delete this post?')) {
            return;
        }

        setIsDeleting(true);
        try {
            await apiService.deletePost(post.id);
            navigate('/feed');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete post');
            setIsDeleting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="post-detail-container">
                <div className="loading">Loading post...</div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="post-detail-container">
                <div className="error-message">{error || 'Post not found'}</div>
                <button className="btn btn-primary" onClick={() => navigate('/feed')}>
                    Back to Feed
                </button>
            </div>
        );
    }

    const isOwner = user?.id === post.user_id;

    return (
        <div className="post-detail-container">
            <article className="post-detail">
                <header className="post-header">
                    <h1>{post.title}</h1>
                    <div className="post-meta">
                        <span>Posted {new Date(post.created_at).toLocaleDateString()}</span>
                        {post.updated_at !== post.created_at && (
                            <span> • Edited {new Date(post.updated_at).toLocaleDateString()}</span>
                        )}
                    </div>
                    {post.tags && post.tags.length > 0 && (
                        <div className="post-tags">
                            {post.tags.map((tag) => (
                                <span key={tag} className="tag">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </header>

                <div className="post-content">{post.content}</div>

                {isOwner && (
                    <div className="post-actions">
                        <button
                            className="btn btn-secondary"
                            onClick={() => navigate(`/posts/${post.id}/edit`)}
                        >
                            Edit Post
                        </button>
                        <button
                            className="btn btn-danger"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete Post'}
                        </button>
                    </div>
                )}

                {post.comments && post.comments.length > 0 && (
                    <section className="comments-section">
                        <h2>Comments ({post.comments.length})</h2>
                        <div className="comments-list">
                            {post.comments.map((comment) => (
                                <div key={comment.id} className="comment">
                                    <div className="comment-meta">
                                        {comment.user?.username || 'Anonymous'} •{' '}
                                        {new Date(comment.created_at).toLocaleDateString()}
                                    </div>
                                    <p className="comment-content">{comment.content}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </article>

            <button className="btn btn-secondary" onClick={() => navigate('/feed')}>
                Back to Feed
            </button>
        </div>
    );
}
