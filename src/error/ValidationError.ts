import {Err} from "../Err";
import {IValidationError} from "../Validator";

export class ValidationError extends Err {

    constructor(public violations?: IValidationError, message?: string) {
        super(Err.Code.Validation, message);
    }
}
