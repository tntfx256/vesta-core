import { IQueryOption } from "./Database";

export interface IRequest<T> extends IQueryOption {
    query?: T;
}
