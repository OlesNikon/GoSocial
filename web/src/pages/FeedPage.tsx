import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';
import type { PostWithMetadata, FeedParams } from '../types';
import './Feed.css';

export default function FeedPage() {
    const [posts, setPosts] = useState<PostWithMetadata[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

    const loadFeed = useCallback(async () => {
        setIsLoading(true);
        setError('');

        const params: FeedParams = {
            limit: 20,
            offset: 0,
            sort: sortOrder,
        };

        if (searchTerm) {
            params.search = searchTerm;
        }

        try {
            const data = await apiService.getUserFeed(params);
            setPosts(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load feed');
        } finally {
            setIsLoading(false);
        }
    }, [sortOrder, searchTerm]);

    useEffect(() => {
        loadFeed();
    }, [loadFeed]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        loadFeed();
    };

    return (
        <div className="feed-container">
            <div className="feed-header">
                <h1>Your Feed</h1>
                <Link to="/posts/new" className="btn btn-primary">
                    Create Post
                </Link>
            </div>

            <div className="feed-controls">
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        placeholder="Search posts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <button type="submit" className="btn btn-secondary">
                        Search
                    </button>
                </form>

                <div className="sort-controls">
                    <label>Sort by:</label>
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as 'desc' | 'asc')}
                        className="sort-select"
                    >
                        <option value="desc">Newest First</option>
                        <option value="asc">Oldest First</option>
                    </select>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            {isLoading ? (
                <div className="loading">Loading feed...</div>
            ) : posts.length === 0 ? (
                <div className="empty-state">
                    <h2>No posts yet</h2>
                    <p>Be the first to create a post!</p>
                    <Link to="/posts/new" className="btn btn-primary">
                        Create Post
                    </Link>
                </div>
            ) : (
                <div className="posts-grid">
                    {posts.map((post) => (
                        <article key={post.id} className="post-card">
                            <Link to={`/posts/${post.id}`} className="post-link">
                                <div className="post-card-header">
                                    <h2>{post.title}</h2>
                                    <div className="post-card-meta">
                                        <span className="author">
                                            by {post.user?.username || 'Unknown'}
                                        </span>
                                        <span className="date">
                                            {new Date(post.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                <p className="post-card-content">
                                    {post.content.length > 200
                                        ? `${post.content.substring(0, 200)}...`
                                        : post.content}
                                </p>

                                {post.tags && post.tags.length > 0 && (
                                    <div className="post-card-tags">
                                        {post.tags.slice(0, 3).map((tag) => (
                                            <span key={tag} className="tag">
                                                #{tag}
                                            </span>
                                        ))}
                                        {post.tags.length > 3 && (
                                            <span className="tag">+{post.tags.length - 3} more</span>
                                        )}
                                    </div>
                                )}

                                <div className="post-card-footer">
                                    <span className="comments-count">
                                        💬 {post.comments_count || 0} comments
                                    </span>
                                </div>
                            </Link>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}
