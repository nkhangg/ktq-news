import { HttpStatusCode } from 'axios';

export interface IResponse<R> {
    message: string;
    status_code: HttpStatusCode;
    data: R;
    timestamp: string;
    errors?: { field: string; errors: string[] }[];
}

export interface IResponsePagination<T> extends IResponse<T> {
    current_page: number;
    from: number;
    to: number;
    last_page: number;
    per_page: number;
    total: number;
}
