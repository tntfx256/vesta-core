import {Err} from "../Err";
import {IValidationErrors} from "../Validator";

export class ValidationError extends Err {

    constructor(public violations?: IValidationErrors, message?: string) {
        super(Err.Code.Validation, message);
    }
}
