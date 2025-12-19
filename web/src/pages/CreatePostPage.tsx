import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import type { CreatePostPayload } from '../types';
import './Post.css';

export default function CreatePostPage() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const payload: CreatePostPayload = {
            title,
            content,
            tags: tags
                .split(',')
                .map((tag) => tag.trim())
                .filter((tag) => tag.length > 0),
        };

        try {
            const post = await apiService.createPost(payload);
            navigate(`/posts/${post.id}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create post');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="post-create-container">
            <div className="post-create-card">
                <h1>Create New Post</h1>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="post-form">
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            placeholder="Enter post title"
                            disabled={isLoading}
                            maxLength={100}
                        />
                        <small>{title.length}/100 characters</small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="content">Content</label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                            placeholder="What's on your mind?"
                            disabled={isLoading}
                            maxLength={1000}
                            rows={8}
                        />
                        <small>{content.length}/1000 characters</small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="tags">Tags</label>
                        <input
                            id="tags"
                            type="text"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            placeholder="Enter tags separated by commas (e.g., tech, news, tutorial)"
                            disabled={isLoading}
                        />
                        <small>Separate tags with commas</small>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate(-1)}
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={isLoading}>
                            {isLoading ? 'Creating...' : 'Create Post'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
