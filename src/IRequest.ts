import { IQueryOption } from "./Database";

export interface IRequest<T> extends IQueryOption {
    [key: string]: any;
    query?: T;
}
