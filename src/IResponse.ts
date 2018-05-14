export interface IResponse<T> {
    items?: Array<T>;
    limit?: number;
    page?: number;
    total?: number;
}
