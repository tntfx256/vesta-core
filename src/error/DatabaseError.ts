import { Err, IErrType } from "../Err";

export class DatabaseError extends Err {

    constructor(code: IErrType, public dbError: Error) {
        super(code, dbError && dbError.message);
    }
}
