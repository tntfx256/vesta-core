import { IQueryOption } from './Database';

// @deprecated
export interface IQueryResult<T> {
    items?: Array<T>;
    limit?: number;
    page?: number;
    total?: number;
}

export interface IUpsertResult<T> {
    items: Array<T>;
}

export interface IDeleteResult {
    items: Array<number | string>;
}

export interface IQueryRequest<T> extends IQueryOption {
    query?: T;
}
