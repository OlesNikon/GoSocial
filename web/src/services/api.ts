import { API_URL } from '../config';
import type {
    User,
    Post,
    PostWithMetadata,
    CreatePostPayload,
    UpdatePostPayload,
    RegisterPayload,
    LoginPayload,
    UserWithToken,
    FeedParams,
    ApiError,
} from '../types';

class ApiService {
    private baseURL: string;
    private token: string | null = null;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
        this.token = localStorage.getItem('token');
    }

    setToken(token: string | null) {
        this.token = token;
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }

    getToken(): string | null {
        return this.token;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(options.headers as Record<string, string>),
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const response = await fetch(`${this.baseURL}${endpoint}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const error: ApiError = await response.json().catch(() => ({
                error: `HTTP error! status: ${response.status}`,
            }));
            throw new Error(error.error || error.message || 'An error occurred');
        }

        if (response.status === 204) {
            return {} as T;
        }

        const json = await response.json();
        // Backend wraps responses in {data: ...} envelope
        return json.data !== undefined ? json.data : json;
    }

    // Authentication
    async register(payload: RegisterPayload): Promise<UserWithToken> {
        return this.request<UserWithToken>('/authentication/user', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    }

    async login(payload: LoginPayload): Promise<string> {
        return this.request<string>('/authentication/token', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    }

    async activateUser(token: string): Promise<void> {
        return this.request<void>(`/users/activate/${token}`, {
            method: 'PUT',
        });
    }

    // Posts
    async createPost(payload: CreatePostPayload): Promise<Post> {
        return this.request<Post>('/posts', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    }

    async getPost(id: number): Promise<Post> {
        return this.request<Post>(`/posts/${id}`);
    }

    async updatePost(id: number, payload: UpdatePostPayload): Promise<Post> {
        return this.request<Post>(`/posts/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(payload),
        });
    }

    async deletePost(id: number): Promise<void> {
        return this.request<void>(`/posts/${id}`, {
            method: 'DELETE',
        });
    }

    // Users
    async getUser(id: number): Promise<User> {
        return this.request<User>(`/users/${id}`);
    }

    async followUser(id: number): Promise<void> {
        return this.request<void>(`/users/${id}/follow`, {
            method: 'PUT',
        });
    }

    async unfollowUser(id: number): Promise<void> {
        return this.request<void>(`/users/${id}/unfollow`, {
            method: 'PUT',
        });
    }

    // Feed
    async getUserFeed(params?: FeedParams): Promise<PostWithMetadata[]> {
        const queryParams = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) {
                    queryParams.append(key, String(value));
                }
            });
        }
        const queryString = queryParams.toString();
        return this.request<PostWithMetadata[]>(
            `/users/feed${queryString ? `?${queryString}` : ''}`
        );
    }
}

export const apiService = new ApiService(API_URL);
