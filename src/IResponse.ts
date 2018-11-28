export interface IResponse<T> {
    [key: string]: any;
    items?: Array<T>;
    limit?: number;
    page?: number;
    total?: number;
}
