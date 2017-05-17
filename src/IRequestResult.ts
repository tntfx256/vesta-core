import {Err} from "./Err";

export interface IRequestResult<T> {
    result: T;
    error: Err;
}
