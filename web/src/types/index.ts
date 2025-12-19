export interface User {
    id: number;
    username: string;
    email: string;
    created_at: string;
    is_active: boolean;
    role: Role;
}

export interface Role {
    id: number;
    name: string;
    level: number;
    description: string;
}

export interface Post {
    id: number;
    title: string;
    content: string;
    tags: string[];
    user_id: number;
    created_at: string;
    updated_at: string;
    version: number;
    comments?: Comment[];
}

export interface PostWithMetadata extends Post {
    user: User;
    comments_count: number;
}

export interface Comment {
    id: number;
    post_id: number;
    user_id: number;
    content: string;
    created_at: string;
    user?: User;
}

export interface CreatePostPayload {
    title: string;
    content: string;
    tags: string[];
}

export interface UpdatePostPayload {
    title?: string;
    content?: string;
}

export interface RegisterPayload {
    username: string;
    email: string;
    password: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface UserWithToken {
    user: User;
    token: string;
}

export interface FeedParams {
    limit?: number;
    offset?: number;
    sort?: string;
    since?: string;
    until?: string;
    tags?: string;
    search?: string;
}

export interface ApiError {
    error: string;
    message?: string;
}
