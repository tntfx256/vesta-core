import {IQueryOption} from "./Database";

export interface IQueryResult<T> {
    total?: number;
    limit?: number;
    page?: number;
    items?: Array<T>;
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