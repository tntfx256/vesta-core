import {Err} from "./Err";
import {IQueryOption} from "./Database";

export interface IQueryResult<T> {
    total?: number;
    limit?: number;
    page?: number;
    items?: Array<T>;
}

export interface IUpsertResult<T> {
    items: Array<T>;
    error: Err;
}

export interface IDeleteResult {
    items: Array<number|string>;
    error: Err;
}

export interface IQueryRequest<T> extends IQueryOption {
    query?: T;
}