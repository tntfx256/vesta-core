import { Err } from "../Err";
export class DatabaseError extends Err {
    constructor(code, dbError) {
        super(code, dbError && dbError.message);
        this.dbError = dbError;
    }
}
