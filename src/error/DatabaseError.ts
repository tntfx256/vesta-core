import {Err} from "../Err";

export class DatabaseError extends Err {

    constructor(code: number, public dbError: Error) {
        super(code, dbError && dbError.message);
    }
}
