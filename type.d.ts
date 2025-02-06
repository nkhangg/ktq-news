declare global {
    namespace globalThis {
        const mongoose: { conn: mongoose.Connection | null; promise: Promise<mongoose.Connection> | null };
    }
}

interface IModel {
    _id: string;
    createdAt?: Date;
    updatedAt?: Date;
}

interface IPost extends IModel {
    thumbnail: string;
    slug: string;
    title: string;
    content: string;
    preview_content: string;
    like_count: number;
    user: IUser;
    category: ICategory;
    ttr: number;
}

interface IUser extends IModel {
    username: string;
    password: string;
    fullname: string;
    email: string;
    role: 'admin' | 'client';
}

type ICategory = {
    name: string;
    description: string;
    slug: string;
    post_count?: number;
} & IModel;

interface IHistory extends IModel {
    ip_client: string;
    post: IPost;
}

interface IConfig extends IModel {
    key: string;
    value: unknown;
}

interface ICache extends IModel {
    cache_key: string;
    value: string;
    ttl: number;
}

interface IMedia extends IModel {
    original_url?: string;
    cloud_data: ICLoudData;
}

interface ILike extends IModel {
    ip_client: string;
    post: IPost;
    action: 'like' | 'unlike';
}

interface ISearchHistory extends IModel {
    post: IPost;
    search_count: number;
}

interface IPaginateResponse<T> {
    data: T[];
    total: number;
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    has_prev_page: boolean;
    has_next_page: boolean;
}

interface ICLoudData {
    asset_id: string;
    public_id: string;
    version: number;
    version_id: string;
    signature: string;
    width: number;
    height: number;
    format: string;
    resource_type: string;
    created_at: string;
    tags: unknown[];
    bytes: number;
    type: string;
    etag: string;
    placeholder: boolean;
    url: string;
    secure_url: string;
    folder: string;
    overwritten: boolean;
    original_filename: string;
    api_key: string;
}
